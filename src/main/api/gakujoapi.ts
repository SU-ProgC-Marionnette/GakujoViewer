import { Scraper } from "../scraper/scraper"
import { Pages } from "../data/pages"

export class GakujoApi {
	private scraper: Scraper = new Scraper()
	private _ready: boolean = false

	constructor() {
	}

	public init = async(): Promise<void> => {
		await this.scraper.init()
		this._ready = true
	}

	// test method
	public getTitle = async(): Promise<string | null> => {
		if(!this.ready) {
			return null
		}

		return await this.scraper.getTitle()
	}

	public movePage = async(page: Pages): Promise<boolean> => {
		if(!this.ready) {
			return false
		}

		return await this.scraper.movePage(page)
	}

	public get ready(): boolean {
		return this._ready
	}

	private set ready(ready: boolean) {
		this._ready = ready
	}
}
