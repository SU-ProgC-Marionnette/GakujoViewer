<template>
	<v-footer app elevation="2">
		<v-btn v-if="apiStatus == apiStore.statuses.UNCONNECTED" class="mr-4" density="comfortable" color="warning"
			prepend-icon="mdi-reload" @click="apiStore.init()">
			{{ $t("app.connect") }}
		</v-btn>
		{{ apiStatusStr }}
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
			return t("app.api_unconnected")

		case apiStore.statuses.CONNECTING:
			return t("app.api_connecting")

		case apiStore.statuses.CONNECTED:
			return t("app.api_connected")

		default:
			return t("app.api_unknown")
	}
})
</script>
