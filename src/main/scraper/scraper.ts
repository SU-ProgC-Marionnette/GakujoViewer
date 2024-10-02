import puppeteer from 'puppeteer'
import log from 'electron-log/main'

import { FileUtil } from '../util/fileutil'
import { StringUtil } from '../util/stringutil'
import { AppBrowser } from './appbrowser'
import { Pages } from '../data/pages'
import { TableData } from '../data/tabledata'
import { ContactDetailData, ExpireDetailData } from '../data/detaildata'
import { Selectors } from '../data/selectors'

// 学務情報の軽微な仕様変更(ID, Class名の変更)にも柔軟に対応できるよう
// CSSセレクタやswitchによる分岐などをあえて冗長にしておく
export class Scraper {
	private url = 'https://gakujo.shizuoka.ac.jp/'
	private browser
	private page

	private _currentPage: Pages = Pages.Gakujo
	private _ready; boolean = false

	constructor() {
	}

	public init = async(): Promise<boolean> => {
		// ログインCookieを取ってくる用のAppBrowserのインスタンスを用意しておく(この時点ではまだ開かない)
		const appBrowser = new AppBrowser()

		// 最後に現在ページのIDを入れる変数
		let elmId: string = ''

		// 学情のホームに辿りつくまで試行(Cookieが無くて or 期限切れなどでログインできなかったときやり直す)
		while(elmId != Selectors.topPageId) {
			// 保存されたcookieを取得
			let cookieStr: string = await FileUtil.read(FileUtil.LOGIN_COOKIE)
			while(cookieStr == '') {
				// Cookieが保存されてないときAppBrowserでログイン画面を表示
				await appBrowser.login()
				cookieStr = await FileUtil.read(FileUtil.LOGIN_COOKIE)
			}

			// Puppeteerの内部ブラウザ(画面上に表示されない、ユーザが操作できない)を開く
			this.browser = await puppeteer.launch({
				headless: true
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
				await this.page.waitForSelector(Selectors.loginBtn)
				// 「ログイン」ボタンをクリック
				// 通常は `page.click(CSSセレクタ)` でクリックできるがこのページでは失敗することがあるので代替
				// 参考: https://qiita.com/kurokawa516/items/31d039736a470b259667
				// ログインボタンのElementHandle(PuppeteerでDOMを扱うときの型)を取得
				const loginBtn = await this.page.$(Selectors.loginBtn)
				// 内部ブラウザ側のJavaScriptでボタンをクリックするコードを実行
				await loginBtn.evaluate(btn => btn.click())

				// トップページかログイン画面か送信属性選択画面が読みこまれるのを待つ
				let elmHandle = await this.page.waitForSelector([
					Selectors.topPage,
					Selectors.msLoginPage,
					Selectors.msOtpPage,
					Selectors.suSSOPage,
					Selectors.dialogCloseBtn
				].join(','))

				// 上で検出した要素のIDを取得
				elmId = await elmHandle.evaluate(elm => elm.id)
				let elmClass = await elmHandle.evaluate(elm => elm.className)

				// IDかclass名で処理を分岐
				if(elmId == Selectors.msLoginPageId || elmId == Selectors.msOtpPageId) {
					// 自動ログインできなかったときログイン画面を表示
					await this.browser.close() // 同時に開くとバグる可能性があるので内部ブラウザを閉じる
					await appBrowser.login()

					continue
				}

				if(elmClass == Selectors.suSSOPageClass) {
					// 送信属性の選択画面の同意ボタンが出たならそれを押す
					await elmHandle.click()

					elmHandle = await this.page.waitForSelector([
						Selectors.topPage,
						Selectors.dialogCloseBtn
					].join(','))

					elmClass = await elmHandle.evaluate(elm => elm.className)
					elmId = await elmHandle.evaluate(elm => elm.id)
				}

				if(elmClass.indexOf(Selectors.dialogCloseClass) !== -1) {
					// なにかダイアログが出ているので閉じてトップページへ
					// 閉じるときにページを離れますか？が出た場合自動で閉じるようにしておく
					this.page.on('dialog', dialog => dialog.type() === 'beforeunload' && dialog.accept())

					await elmHandle.evaluate(elm => elm.click())
					await (await this.page.waitForSelector(Selectors.logoBtn)).evaluate(elm => elm.click())
				}

				elmId = await (
					await this.page.waitForSelector(Selectors.topPage)
				).evaluate(elm => elm.id)

				if(elmId != Selectors.topPageId) {
					// 例外のとき次のwhileループに備えて内部ブラウザを閉じる
					await this.browser.close()
					continue
				}
			} catch(e) {
				console.error(e)
				log.error(e)

				await this.browser.close()
				return false
			}
		}

		this._currentPage = Pages.Top
		this._ready = true

		return true
	}

	public movePage = async (page: Pages): Promise<boolean> => {
		try {
			// メニューを開く
			await (await this.page.waitForSelector(Selectors.menuBtn)).click()

			switch(page) {
				case Pages.Top:
					await this.page.goto(this.url)
					break

				case Pages.Contact:
					await (await this.page.waitForSelector(Selectors.menuContactLink)).click()
					break

				case Pages.Subject:
					await (await this.page.waitForSelector(Selectors.menuSubjectLink)).click()
					await (await this.page.waitForSelector(Selectors.menuSubjectListLink)).click()
					break
			}

			await this.page.waitForNavigation()

			return true
		} catch(e) {
			console.error(e)
			log.error(e)

			await this.browser.close()
			this._ready = false

			return false
		}
	}

	public getTable = async(): Promise<TableData[]> => {
		const timeout = 1000

		try {
			let result = []

			// 次へボタンが押せなくなるまで繰り返す
			while(true) {
				result = result.concat(await (
					await this.page.waitForSelector(
						Selectors.dataTable,
						{timeout: timeout}
					)
				).evaluate((elm, statusNotice) =>
					// テーブルをHTMLTableElementからarrayに変換
					Array.from(elm.rows).map((row: any) => {// anyにしないと動かない
						const newCells: TableData = {
							id: -1,
							cells: [],
							read: false,
							important: false
						}

						// データのインデックスを取得
						const idStr = row.getAttribute('_index')
						if(idStr !== null) {
								newCells.id = parseInt(idStr)
						}

						for(let i = 0; i < row.cells.length; i++) {
							const cell = row.cells[i]

							newCells.cells.push(cell.innerText)
						}

						// 重要かどうか
						if(row.querySelector(statusNotice) !== null) {
							newCells.important = true
						}

						// 未読かどうか
						if(row.getAttribute('style') === null) {
							newCells.read = true
						}

						return newCells
					}),
					Selectors.statusNotice
				))

				// 次ページへ
				const nextElmHandle = await this.page.waitForSelector(Selectors.dataTableNextBtn)
				const nextDisabled = await nextElmHandle.evaluate(elm => elm.classList.contains('disabled'))

				const tableBodyElmHandle = await this.page.waitForSelector(Selectors.dataTable + ' > tbody')
				const tableBodyText = await tableBodyElmHandle.evaluate(elm => elm.innerText)

				if(nextDisabled || tableBodyText === '表示する情報はありません。') {
					break
				}

				await nextElmHandle.evaluate(elm => elm.click())
			}

			return result
		} catch(e) {
			return []
		}
	}

	public getDetails = async (page: Pages, id: number): Promise<ContactDetailData | ExpireDetailData | null> => {
		if(!await this.movePage(page)) {
			return null
		}

		try {
			// リンクを見つける
			let isFound = false
			while(true) {
				isFound = await (
					await this.page.waitForSelector(Selectors.dataTable)
				).evaluate((elm, id) => {
					const row: any = elm.querySelector(`tr[_index="${id}"]`)

					if(row !== null) {
						row.cells[1].click()
						return true
					}

					return false
				}, id)

				if(isFound) {
					break
				}

				const nextElmHandle = await this.page.waitForSelector(Selectors.dataTableNextBtn)
				const nextDisabled = await nextElmHandle.evaluate(elm => elm.classList.contains('disabled'))

				if(nextDisabled) {
					break
				}

				await nextElmHandle.evaluate(elm => elm.click())
			}

			if(isFound) {
				switch(page) {
					case Pages.Contact:
						{
							// データをObjectに変換
							const data = await (
								await this.page.waitForSelector(Selectors.lineTable)
							).evaluate(elm => Object.fromEntries(
								Array.from(elm.rows).map((row: any) =>
									Array.from(row.cells).map((cell: any) =>
										cell.innerText
									)
								)
							))

							// タイトル, 種別, カテゴリを取得
							const title = await(
								await this.page.waitForSelector(Selectors.contactTitle)
							).evaluate(elm =>
								elm.innerText
							)

							const type = await(
								await this.page.waitForSelector(Selectors.contactType)
							).evaluate(elm =>
								elm.innerText
							)

							const category = await(
								await this.page.waitForSelector(Selectors.contactCategory)
							).evaluate(elm =>
								elm.innerText
							)

							const dates = StringUtil.toDateArray(data.連絡日時)
							let date: Date | null = null
							if(dates !== null && dates.length >= 1) {
								date = dates[0]
							}

							return new ContactDetailData(
								title,
								date,
								type,
								data.ファイル,
								'',
								data.内容,
								'',
								data.重要度,
								''
							)
						}

					case Pages.Subject:
						{
							// タイトル, 評価方法, 期限を取得
							const title = await(
								await this.page.waitForSelector(Selectors.subjectTitle)
							).evaluate(elm =>
								elm.innerText
							)

							const reviewMethod = await(
								await this.page.waitForSelector(Selectors.subjectReviewMethod)
							).evaluate(elm =>
								elm.innerText
							)

							const expireDateStr = await(
								await this.page.waitForSelector(Selectors.subjectExpireDate)
							).evaluate(elm =>
								elm.innerText
							)

							const description = await(
								await this.page.waitForSelector(Selectors.subjectDescription)
							).evaluate(elm =>
								elm.innerText
							)

							const dates = StringUtil.toDateArray(expireDateStr)
							let date: Date | null = null
							if(dates !== null) {
								date = dates[0]
							}

							return new ExpireDetailData(
								title,
								null,
								date,
								reviewMethod,
								description,
								'',
								''
							)
						}

					default:
						return null
				}
			} else {
				return null
			}
		} catch(e) {
			console.error(e)
			return null
		}
	}

	public get currentPage(): Pages {
		return this._currentPage
	}

	public get ready(): boolean {
		return this._ready
	}
}
