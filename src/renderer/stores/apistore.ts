import { defineStore } from 'pinia'

const statuses = { // enum
	UNCONNECTED: 0,
	CONNECTING: 1,
	CONNECTED: 2
}

export const useApiStore = defineStore('api', {
	state: () => ({
		statuses: statuses,
		status: statuses.UNCONNECTED,
		title: null
	}),
	actions: {
		async init() {
			this.status = this.statuses.CONNECTING
			await window.electronAPI.initApi()
			this.status = this.statuses.CONNECTED

			this.updateTitle()
		},
		async updateTitle() {
			this.title = await window.electronAPI.getTitle()
		}
	}
})
