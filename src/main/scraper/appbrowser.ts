import puppeteer from 'puppeteer'
import log from 'electron-log/main'

import { FileUtil } from '../util/fileutil'
import { Selectors } from '../data/selectors'

export class AppBrowser {
	private url = 'https://gakujo.shizuoka.ac.jp/'
	private browser
	private page

	constructor() {
	}

	public async login(): Promise<void> {
		// 保存されたcookieを取得
		const cookieStr: string = await FileUtil.read(FileUtil.LOGIN_COOKIE)

		this.browser = await puppeteer.launch({
			headless: false,
			args: ['--app=' + this.url] // アドレスバーを非表示
		})

		try {
			this.page = (await this.browser.pages()).slice(-1)[0]

			// 保存されてたcookieを復元
			if(cookieStr != '') {
				const oldCookies = JSON.parse(cookieStr)
				await this.page.setCookie(...oldCookies)
			}

			// login
			await this.page.waitForSelector(Selectors.loginBtn)
			const loginBtn = await this.page.$(Selectors.loginBtn)
			await loginBtn.evaluate(btn => btn.click())

			// 手動でログインしてもらう

			// トップページが読みこまれるのを待つ
			await this.page.waitForSelector(Selectors.topPage, {
				timeout: 0
			})

			// cookieを保存(3rd party cookieを含む)
			const client = await this.page.target().createCDPSession()
			const cookies = (await client.send('Network.getAllCookies')).cookies
			await FileUtil.write(FileUtil.LOGIN_COOKIE, JSON.stringify(cookies))
		} catch(e) {
			console.error(e)
			log.error(e)
		} finally {
			await this.browser.close()
		}

		return
	}
}
