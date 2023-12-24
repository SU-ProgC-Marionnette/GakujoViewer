import puppeteer from 'puppeteer'

import { FileUtil } from '../util/fileutil'

export class AppBrowser {
	private url = 'https://gakujo.shizuoka.ac.jp/portal/'
	private browser
	private page

	constructor() {
	}

	public async login(): Promise<void> {
		this.browser = await puppeteer.launch({
			headless: false,
			args: ['--app=' + this.url] // アドレスバーを非表示
		})
		this.page = (await this.browser.pages()).slice(-1)[0]

		// login
		const loginBtnSel: string = '.btn_login'
		await this.page.waitForSelector(loginBtnSel)
		const loginBtn = await this.page.$(loginBtnSel)
		await loginBtn.evaluate(btn => btn.click())

		// 手動でログインしてもらう

		// トップページが読みこまれるのを待つ
		await this.page.waitForSelector('#home.new', {
			timeout: 0
		})

		// cookieを保存(3rd party cookieを含む)
		const client = await this.page.target().createCDPSession()
		const cookies = (await client.send('Network.getAllCookies')).cookies
		await FileUtil.write(FileUtil.LOGIN_COOKIE, JSON.stringify(cookies))

		await this.browser.close()

		return
	}
}
