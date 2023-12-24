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
		const gakujoHomeSel: string = '#home.new' // 学情のホーム画面検出
		const msLoginSel: string = '#i0116' // ログイン画面検出

		const appBrowser = new AppBrowser()
		let elmId: string = ''

		// 学情のホームに辿りつくまで試行
		while(elmId == '' || gakujoHomeSel.indexOf(elmId) == -1) {
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

			// トップページかログイン画面が読みこまれるのを待つ
			const elmHandle = await this.page.waitForSelector([gakujoHomeSel, msLoginSel].join(','), {
				timeout: 0
			})
			elmId = '#' + (await elmHandle.evaluate(elm => elm.id))

			if(elmId == msLoginSel) {
				// 自動ログインできなかったときログイン画面を表示
				await this.browser.close()
				await appBrowser.login()
			}
		}

		return
	}

	// test method
	public getTitle = async(): Promise<string> => {
		return await this.page.title()
	}
}
