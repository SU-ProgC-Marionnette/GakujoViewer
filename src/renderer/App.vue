<template>
	<v-app>
		<StatusBar />
		<NavDrawer />
		<v-main>
			<router-view></router-view>
		</v-main>
	</v-app>
</template>

<script setup>
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { useApiStore } from "./stores/apistore"

import StatusBar from "./components/StatusBar.vue"
import NavDrawer from "./components/NavDrawer.vue"

const { t } = useI18n()

const apiStore = useApiStore()

if (window.electronAPI.nodeEnv != "development") {
	apiStore.init()
}
</script>
