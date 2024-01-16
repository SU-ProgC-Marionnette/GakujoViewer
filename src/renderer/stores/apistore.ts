import { defineStore } from 'pinia'
import { Pages } from '../../main/data/pages'

import { stringify, parse } from './serializer'

/*
import { ReportData } from '../../main/data/reportdata'
import { ContactData } from '../../main/data/contactdata'
import { ExamData } from '../../main/data/examdata'
*/

const statuses = { // enum
	UNCONNECTED: 0,
	CONNECTING: 1,
	CONNECTED: 2
}

export const useApiStore = defineStore('api', {
	state: () => ({
		statuses: statuses,
		status: statuses.UNCONNECTED,
		title: null,
		reportList: [],
		contactList: [],
		examList: [],
		reportListDate: null as Date | null,
		contactListDate: null as Date | null,
		examListDate: null as Date | null
	}),
	actions: {
		async init() {
			this.status = this.statuses.CONNECTING
			await window.electronAPI.initApi()
			this.updateStatus()
		},
		async updateStatus() {
			const isReady = await window.electronAPI.isReady()

			if(isReady) {
				this.status = this.statuses.CONNECTED
				this.updateTitle()
			} else {
				this.status = statuses.UNCONNECTED
			}
		},
		async updateTitle() {
			this.title = await window.electronAPI.getTitle()
		},
		async movePage(page: Pages): Promise<boolean> {
			const result = await window.electronAPI.movePage(page)
			this.updateTitle()
			this.updateStatus()
			return result
		},
		async getTable(): Promise<string[][]> {
			return await window.electronAPI.getTable()
		},
		async updateReportList() {
			if(await this.movePage(Pages.Report)) {
				this.reportList = await window.electronAPI.getTableData()
				this.reportListDate = new Date()
			}
			this.updateStatus()
		},
		async updateContactList() {
			if(await this.movePage(Pages.Contact)) {
				this.contactList = await window.electronAPI.getTableData()
				this.contactListDate = new Date()
			}
			this.updateStatus()
		},
		async updateExamList() {
			if(await this.movePage(Pages.Exam)) {
				this.examList = await window.electronAPI.getTableData()
				this.examListDate = new Date()
			}
			this.updateStatus()
		},
	},
	persist: {
		paths: [
			'reportList',
			'contactList',
			'examList',
			'reportListDate',
			'contactListDate',
			'examListDate'
		],
		serializer: {
			serialize: stringify,
			deserialize: parse
		}
	}
})
