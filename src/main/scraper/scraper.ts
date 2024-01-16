import puppeteer from 'puppeteer'
import log from 'electron-log/main'

import { FileUtil } from '../util/fileutil'
import { AppBrowser } from './appbrowser'
import { Pages } from '../data/pages'

// 学務情報の軽微な仕様変更(ID, Class名の変更)にも柔軟に対応できるよう
// CSSセレクタやswitchによる分岐などをあえて冗長にしておく
export class Scraper {
	private url = 'https://gakujo.shizuoka.ac.jp/portal/'
	private browser
	private page

	private _currentPage: Pages = Pages.Gakujo

	constructor() {
	}

	public init = async(): Promise<boolean> => {
		// CSSセレクタ
		// HTML内のID or class名
		const gakujoHomeSelId: string = 'home'
		const msLoginSelId: string = 'i0116'
		const msOtpSelId: string = 'idTxtBx_SAOTCC_OTC'
		const gakujoSsoSelClass: string = 'button--full'

		// セレクタ文字列を定義
		const gakujoHomeSel: string = `#${gakujoHomeSelId}.new` // 学情のホーム画面検出
		const msLoginSel: string = `#${msLoginSelId}` // ログイン画面検出
		const msOtpSel: string = `#${msOtpSelId}` // ワンタイムパスワード入力画面検出
		const gakujoSsoSel: string = `.${gakujoSsoSelClass}[name="_eventId_proceed"]` // 送信属性の選択画面検出
		const loginBtnSel: string = '.btn_login' // トップページのログインボタン
		const selStr = [
			gakujoHomeSel, gakujoSsoSel, msLoginSel, msOtpSel
		].join(',') // トップページのログインボタンを押したあとに遷移する可能性のあるページを検出するセレクタを列挙

		// ログインCookieを取ってくる用のAppBrowserのインスタンスを用意しておく(この時点ではまだ開かない)
		const appBrowser = new AppBrowser()

		// 最後に現在ページのIDを入れる変数
		let elmId: string = ''

		// 学情のホームに辿りつくまで試行(Cookieが無くて or 期限切れなどでログインできなかったときやり直す)
		while(elmId != gakujoHomeSelId) {
			// 保存されたcookieを取得
			let cookieStr: string = await FileUtil.read(FileUtil.LOGIN_COOKIE)
			while(cookieStr == '') {
				// Cookieが保存されてないときAppBrowserでログイン画面を表示
				await appBrowser.login()
				cookieStr = await FileUtil.read(FileUtil.LOGIN_COOKIE)
			}

			// Puppeteerの内部ブラウザ(画面上に表示されない、ユーザが操作できない)を開く
			this.browser = await puppeteer.launch({
				headless: 'new'
			})

			try {
				this.page = await this.browser.newPage()

				// 学情にアクセス
				await this.page.goto(this.url)

				// 保存されてたcookieを復元
				const cookies = JSON.parse(cookieStr)
				await this.page.setCookie(...cookies)

				// login
				// 学情トップの「ログイン」ボタンが表示されるまで待つ
				await this.page.waitForSelector(loginBtnSel)
				// 「ログイン」ボタンをクリック
				// 通常は `page.click(CSSセレクタ)` でクリックできるがこのページでは失敗することがあるので代替
				// 参考: https://qiita.com/kurokawa516/items/31d039736a470b259667
				// ログインボタンのElementHandle(PuppeteerでDOMを扱うときの型)を取得
				const loginBtn = await this.page.$(loginBtnSel)
				// 内部ブラウザ側のJavaScriptでボタンをクリックするコードを実行
				await loginBtn.evaluate(btn => btn.click())

				// トップページかログイン画面か送信属性選択画面が読みこまれるのを待つ
				const elmHandle = await this.page.waitForSelector(selStr)

				// 上で検出した要素のIDとclassを取得
				elmId = await elmHandle.evaluate(elm => elm.id)
				const elmClass = await elmHandle.evaluate(elm => elm.className)

				// IDかclass名で処理を分岐
				if(elmClass == gakujoSsoSelClass) {
					// 送信属性の選択画面の同意ボタンが出たならそれを押す
					await elmHandle.click()

					// 遷移先は学情のホームなのでそれを読みこむのを待ちつつ、
					// このwhileを抜けるためにIDを取得する
					elmId = await (
						await this.page.waitForSelector(gakujoHomeSel)
					).evaluate(elm => elm.id)
				} else if(elmId == msLoginSelId || elmId == msOtpSelId) {
					// 自動ログインできなかったときログイン画面を表示
					await this.browser.close() // 同時に開くとバグる可能性があるので内部ブラウザを閉じる
					await appBrowser.login()
				} else if(elmId != gakujoHomeSelId) {
					// 例外のとき次のwhileループに備えて内部ブラウザを閉じる
					await this.browser.close()
				}
			} catch(e) {
				console.error(e)
				log.error(e)

				await this.browser.close()
				return false
			}
		}

		this._currentPage = Pages.Top

		return true
	}

	// movePage作成
	public movePage = async (page: Pages): Promise<boolean> => {
		// CSSセレクタ
		const toClassSupportOnClick = 'classSupport' // 授業サポートページに飛ぶボタンに付いているonclick属性に含まれる文字列
		const toReportOnClick = 'A02'
		const toContactOnClick = 'A01'
		const toExamOnClick = 'A03'

		const toClassSupportSelector = `#header-menu-sub a[onclick*="${toClassSupportOnClick}"]` // 授業サポートページに飛ぶセレクタ
		const toReportSelector = `#gnav-menu a[onclick*="${toReportOnClick}"]`
		const toContactSelector = `#gnav-menu a[onclick*="${toContactOnClick}"]`
		const toExamSelector = `#gnav-menu a[onclick*="${toExamOnClick}"]`

		const linkSelectors = [
			toClassSupportSelector,
			toReportSelector,
			toContactSelector,
			toExamSelector
		].join(',')


		const elmHandle = await this.page.waitForSelector(linkSelectors)
		const elmOnClickStr = await elmHandle.evaluate(elm => elm.getAttribute('onclick'))
		
		switch(page) {
			case Pages.Contact:
			case Pages.Report:
			case Pages.Exam:
				if(elmOnClickStr.indexOf(toClassSupportOnClick) != -1) {
					// 「ホーム」ページにいるので授業サポートページに
					// 飛んでほかのリンクをクリックできるようにする
					await elmHandle.evaluate(elm => elm.click())
				}
				switch(page) {
					case Pages.Contact:
						await(await this.page.waitForSelector(toContactSelector)).evaluate(elm => elm.click())
						break
					case Pages.Report:
						await(await this.page.waitForSelector(toReportSelector)).evaluate(elm => elm.click())
						break
					case Pages.Exam:
						await(await this.page.waitForSelector(toExamSelector)).evaluate(elm => elm.click())
						break
				}
			await this.page.waitForNavigation()
			return true
			default:
				return false
		}
	}

	// test method
	public getTitle = async(): Promise<string> => {
		return await this.page.title()
	}

	public getTable = async(): Promise<string[][]> => {
		const searchListSelector = '#searchList'
		const tableSelector = '#tbl_A01_01'
		const selectors = [
			searchListSelector,
			tableSelector
		].join(',')

		const nextBtnSelector = '#searchList_next,#tbl_A01_01_next'

		try {
			let result = []

			// 次へボタンが押せなくなるまで繰り返す
			while(true) {
				result = result.concat(await (
					await this.page.waitForSelector(selectors)
				).evaluate(elm =>
					// テーブルをHTMLTableElementからarrayに変換
					Array.from(elm.rows).map((row: any) => // anyにしないと動かない
						Array.from(row.cells).map((cell: any) =>
							cell.innerText
						)
					)
				))

				// 次ページへ
				const nextElmHandle = await this.page.waitForSelector(nextBtnSelector)
				const nextDisabled = await nextElmHandle.evaluate(elm => elm.classList.contains('ui-state-disabled'))

				if(nextDisabled) {
					break
				}

				await nextElmHandle.evaluate(elm => elm.click())
			}

			return result
		} catch(e) {
			return []
		}
	}

	public get currentPage(): Pages {
		return this._currentPage
	}
}
