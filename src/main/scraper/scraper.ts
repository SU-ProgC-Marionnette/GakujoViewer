import puppeteer from 'puppeteer'

import { FileUtil } from '../util/fileutil'
import { AppBrowser } from './appbrowser'

export class Scraper {
	private url = 'https://gakujo.shizuoka.ac.jp/portal/'
	private browser
	private page

	constructor() {
	}

	public init = async(): Promise<void> => {
		// CSSセレクタ
		// HTML内のID or class名
		const gakujoHomeSelId: string = 'home'
		const msLoginSelId: string = 'i0116'
		const gakujoSsoSelClass: string = 'button--full'

		// セレクタ文字列を定義
		const gakujoHomeSel: string = `#${gakujoHomeSelId}.new` // 学情のホーム画面検出
		const msLoginSel: string = `#${msLoginSelId}` // ログイン画面検出
		const gakujoSsoSel: string = `.${gakujoSsoSelClass}[name="_eventId_proceed"]` // 送信属性の選択画面検出
		const loginBtnSel: string = '.btn_login' // トップページのログインボタン
		const selStr = [
			gakujoHomeSel, gakujoSsoSel, msLoginSel
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
			if(elmId == msLoginSelId) {
				// 自動ログインできなかったときログイン画面を表示
				await this.browser.close() // 同時に開くとバグる可能性があるので内部ブラウザを閉じる
				await appBrowser.login()   // AppBrowserでログインページを表示
			} else if(elmClass == gakujoSsoSelClass) {
				// 送信属性の選択画面の同意ボタンが出たならそれを押す
				await elmHandle.click()

				// 遷移先は学情のホームなのでそれを読みこむのを待ちつつ、
				// このwhileを抜けるためにIDを取得する
				elmId = await (
					await this.page.waitForSelector(gakujoHomeSel)
					).evaluate(elm => elm.id)
			} else if(elmId != gakujoHomeSelId) {
				// 例外のとき次のwhileループに備えて内部ブラウザを閉じる
				// TODO: 例外処理をちゃんとする
				await this.browser.close()
			}
		}

		return
	}

	// test method
	public getTitle = async(): Promise<string> => {
		return await this.page.title()
	}
}
