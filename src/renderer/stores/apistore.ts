import { defineStore } from 'pinia'

import { stringify, parse } from './serializer'

import { ContactDetailData, ExpireDetailData } from '../../main/data/detaildata'
import { Pages } from '../../main/data/pages'

const progressUpdateInterval = 1000

const statuses = { // enum
	UNCONNECTED: 0,
	CONNECTING: 1,
	CONNECTED: 2
}

export const useApiStore = defineStore('api', {
	state: () => ({
		statuses: statuses,
		status: statuses.UNCONNECTED,
		interval: 600e3, // TODO: 設定から読みこむようにする
		wait: 5e3,
		intervalProgress: 0,
		autoUpdateRunning: false,
		autoUpdateLooping: false,
		progresUpdaterId: null as number | null,
		title: null,
		reportList: [],
		contactList: [],
		examList: [],
		reportListDate: null as Date | null,
		contactListDate: null as Date | null,
		examListDate: null as Date | null,
		reportDetails: {} as { [id: number]: ExpireDetailData },
		contactDetails: {} as { [id: number]: ContactDetailData },
		examDetails: {} as { [id: number]: ExpireDetailData },
		showingDetailPage: null as Pages | null,
		showingDetailId: null as number | null,
	}),
	actions: {
		async init() {
			this.status = this.statuses.CONNECTING
			await window.electronAPI.initApi()
			this.updateStatus()
			this.loop()
			this.progresUpdaterId = setInterval(this.updateProgress, progressUpdateInterval)
		},
		async loop() {
			this.autoUpdateRunning = true
			this.autoUpdateLooping = true

			await this.updateReportList()
			await new Promise(resolve => setTimeout(resolve, this.wait))

			await this.updateContactList()
			await new Promise(resolve => setTimeout(resolve, this.wait))

			await this.updateExamList()
			await new Promise(resolve => setTimeout(resolve, this.wait))

			this.autoUpdateRunning = false

			if(this.status === this.statuses.CONNECTED) {
				this.intervalProgress = 0
				setTimeout(this.loop, this.interval)
			} else {
				this.autoUpdateLooping = false
				this.intervalProgress = 0
			}
		},
		async updateProgress() {
			if(!this.autoUpdateRunning) {
				if(this.autoUpdateLooping) {
					this.intervalProgress += progressUpdateInterval
				}
			} else {
				this.intervalProgress = 0
			}
		},
		async updateStatus() {
			const isReady = await window.electronAPI.isReady()

			if(isReady) {
				this.status = this.statuses.CONNECTED
				this.updateTitle()
			} else {
				this.status = statuses.UNCONNECTED
				this.autoUpdateRunning = true
				this.autoUpdateLooping = false
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
		async updateDetails(page: Pages, id: number) {
			switch(page) {
				case Pages.Report:
					if(this.reportDetails[id] !== undefined) {
						return this.reportDetails[id]
					}
					break

				case Pages.Contact:
					if(this.contactDetails[id] !== undefined) {
						return this.contactDetails[id]
					}
					break

				case Pages.Exam:
					if(this.examDetails[id] !== undefined) {
						return this.examDetails[id]
					}
			}

			const data = await window.electronAPI.getDetails(page, id)
			this.updateStatus()

			switch(page) {
				case Pages.Report:
					this.reportDetails[id] = data
					break
				case Pages.Contact:
					this.contactDetails[id] = data
					break
				case Pages.Exam:
					this.examDetails[id] = data
					break
			}

			return data
		},
		async changeDetail(page: Pages, id: number) {
			this.showingDetailPage = page
			this.showingDetailId = id
		}
	},
	persist: {
		paths: [
			'reportList',
			'contactList',
			'examList',
			'reportListDate',
			'contactListDate',
			'examListDate',
			'reportDetails',
			'contactDetails',
			'examDetails'
		],
		serializer: {
			serialize: stringify,
			deserialize: parse
		}
	}
})
