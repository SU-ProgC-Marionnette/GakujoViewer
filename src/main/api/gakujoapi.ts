import { Scraper } from "../scraper/scraper"
import { DataUtil } from "../util/datautil"

import { Pages } from "../data/pages"

import { TableData } from '../data/tabledata'
import { ReportData } from '../data/reportdata'
import { ContactData } from '../data/contactdata'
import { ExamData } from '../data/examdata'
import { ContactDetailData, ExpireDetailData } from '../data/detaildata'

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

		const status = await this.scraper.movePage(page)
		this._ready = this.scraper.ready

		return status
	}

	public getTable = async(): Promise<TableData[]> => {
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

	public getDetails = async(page: Pages, id: number): Promise<ContactDetailData | ExpireDetailData | null> => {
		if(!this.ready) {
			return null
		}

		return await this.scraper.getDetails(page, id)
	}

	public isReady = (): boolean => {
		return this.ready
	}

	public get ready(): boolean {
		this._ready = this.scraper.ready
		return this._ready
	}

	private set ready(ready: boolean) {
		this._ready = ready
	}
}
