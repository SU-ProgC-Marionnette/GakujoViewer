import puppeteer from 'puppeteer'

export class Scraper {
	private url = 'https://gakujo.shizuoka.ac.jp/portal/'
	private browser
	private page

	constructor() {
	}

	public init = async(): Promise<void> => {
		this.browser = await puppeteer.launch({
			// ログインできないのでとりあえずheadless: false
			// headless: 'new'
			headless: false
		})
		this.page = await this.browser.newPage()

		await this.page.goto(this.url)

		// login
		const loginBtnSel: string = '.btn_login'
		await this.page.waitForSelector(loginBtnSel)
		const loginBtn = await this.page.$(loginBtnSel)
		await loginBtn.evaluate(btn => btn.click())

		// ログインは後で実装

		// トップページが読みこまれるのを待つ
		await this.page.waitForSelector('#home.new', {
			timeout: 0
		})

		return
	}

	// test method
	public getTitle = async(): Promise<string> => {
		return await this.page.title()
	}
}
