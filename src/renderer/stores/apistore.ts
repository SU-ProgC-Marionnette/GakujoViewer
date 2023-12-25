import { defineStore } from 'pinia'

export const useApiStore = defineStore('api', {
	state: () => ({
		status: 'API未接続',
		title: null
	}),
	actions: {
		async init() {
			this.status = 'APIに接続中'
			await window.electronAPI.initApi()
			this.status = 'API接続完了'

			this.updateTitle()
		},
		async updateTitle() {
			this.title = await window.electronAPI.getTitle()
		}
	}
})
