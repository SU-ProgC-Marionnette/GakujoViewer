<template>
	<v-footer app elevation="2" class="d-flex justify-space-between">
		<div>
			<v-btn v-if="apiStatus == apiStore.statuses.UNCONNECTED" class="mr-4" density="comfortable" color="warning"
				prepend-icon="mdi-reload" @click="apiStore.init()">
				{{ $t("status.connect") }}
			</v-btn>
			{{ apiStatusStr }}
		</div>
		<div>
			{{ $t("status.auto_update") }}
			<v-progress-circular v-if="autoUpdateEnabled" :model-value="autoUpdateProgressValue" color="primary"
				:indeterminate="autoUpdateRunning"></v-progress-circular>
			<v-icon v-else icon="mdi-close" color="error"></v-icon>
		</div>
	</v-footer>
</template>

<script setup>
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { useApiStore } from "../stores/apistore"

const { t } = useI18n()

const apiStore = useApiStore()

const apiStatus = computed(() => apiStore.status)
const apiStatusStr = computed(() => {
	switch (apiStore.status) {
		case apiStore.statuses.UNCONNECTED:
			return t("status.api_unconnected")

		case apiStore.statuses.CONNECTING:
			return t("status.api_connecting")

		case apiStore.statuses.CONNECTED:
			return t("status.api_connected")

		default:
			return t("status.api_unknown")
	}
})

const autoUpdateProgressValue = computed(() =>
	apiStore.intervalProgress === 0 ?
		0 :
		apiStore.intervalProgress / apiStore.interval * 100
)

const autoUpdateEnabled = computed(() => apiStore.autoUpdateLooping)
const autoUpdateRunning = computed(() => apiStore.autoUpdateRunning)
</script>
