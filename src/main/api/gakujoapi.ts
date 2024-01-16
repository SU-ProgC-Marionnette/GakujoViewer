import { Scraper } from "../scraper/scraper"
import { DataUtil } from "../util/datautil"

import { Pages } from "../data/pages"

import { ReportData } from '../data/reportdata'
import { ContactData } from '../data/contactdata'
import { ExamData } from '../data/examdata'

export class GakujoApi {
	private scraper: Scraper = new Scraper()
	private _ready: boolean = false

	constructor() {
	}

	public init = async(): Promise<boolean> => {
		this._ready = await this.scraper.init()
		return this.ready
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

	public getTable = async(): Promise<string[][]> => {
		if(!this.ready) {
			return []
		}

		return await this.scraper.getTable()
	}

	public getTableData = async(): Promise<ReportData[] | ContactData[] | ExamData[]> => {
		if(!this.ready) {
			return []
		}

		return DataUtil.toDataList(await this.scraper.getTable())
	}

	public get ready(): boolean {
		return this._ready
	}

	private set ready(ready: boolean) {
		this._ready = ready
	}
}
