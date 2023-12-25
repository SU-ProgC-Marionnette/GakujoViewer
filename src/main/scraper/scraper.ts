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
		const gakujoHomeSelId: string = 'home'
		const msLoginSelId: string = 'i0116'
		const gakujoSsoSelClass: string = 'button--full'

		const gakujoHomeSel: string = `#${gakujoHomeSelId}.new` // 学情のホーム画面検出
		const msLoginSel: string = `#${msLoginSelId}` // ログイン画面検出
		const gakujoSsoSel: string = `.${gakujoSsoSelClass}[name="_eventId_proceed"]` // 送信属性の選択画面検出

		const appBrowser = new AppBrowser()
		let elmId: string = ''

		// 学情のホームに辿りつくまで試行(Cookieが無くて/期限切れでログインできなかったときやり直す)
		while(elmId != gakujoHomeSelId) {
			// 保存されたcookieを取得
			let cookieStr: string = await FileUtil.read(FileUtil.LOGIN_COOKIE)
			while(cookieStr == '') {
				// Cookieが保存されてないときログイン画面を表示
				await appBrowser.login()
				cookieStr = await FileUtil.read(FileUtil.LOGIN_COOKIE)
			}

			this.browser = await puppeteer.launch({
				headless: 'new'
			})
			this.page = await this.browser.newPage()

			await this.page.goto(this.url)

			// 保存されてたcookieを復元
			const cookies = JSON.parse(cookieStr)
			await this.page.setCookie(...cookies)

			// login
			const loginBtnSel: string = '.btn_login'
			await this.page.waitForSelector(loginBtnSel)
			const loginBtn = await this.page.$(loginBtnSel)
			await loginBtn.evaluate(btn => btn.click())

			// トップページかログイン画面か送信属性選択画面が読みこまれるのを待つ
			const selStr = [
				gakujoHomeSel, gakujoSsoSel, msLoginSel
			].join(',')
			const elmHandle = await this.page.waitForSelector(selStr)

			elmId = await elmHandle.evaluate(elm => elm.id)
			const elmClass = await elmHandle.evaluate(elm => elm.className)

			if(elmId == msLoginSelId) {
				// 自動ログインできなかったときログイン画面を表示
				await this.browser.close()
				await appBrowser.login()
			} else if(elmClass == gakujoSsoSelClass) {
				// 送信属性の選択画面が出たら同意ボタンを押す
				await elmHandle.click()
				elmId = await (
					await this.page.waitForSelector(gakujoHomeSel)
					).evaluate(elm => elm.id)
			} else if(elmId != gakujoHomeSelId) {
				// 例外のとき閉じてやり直す
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
