<template>
	<v-app>
		<v-footer app elevation="2">
			<v-btn
				v-if="apiStatus == apiStore.statuses.UNCONNECTED"
				class="mr-4"
				density="comfortable"
				color="warning"
				prepend-icon="mdi-reload"
				@click="apiStore.init()"
			>
				{{ $t("app.connect") }}
			</v-btn>
			{{ apiStatusStr }}
		</v-footer>

		<v-navigation-drawer app permanent elevation="2">
			<v-list>
				<v-list-item
					v-for="(view, i) in views"
					:key="i"
					:value="view"
					:to="view.to"
				>
					<v-list-item-title v-text="view.text"></v-list-item-title>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>

		<v-main>
			<router-view></router-view>
		</v-main>
	</v-app>
</template>

<script setup>
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { useApiStore } from "./stores/apistore"

const { t } = useI18n()

const apiStore = useApiStore()

const apiStatus = computed(() => apiStore.status)
const apiStatusStr = computed(() => {
	switch (apiStore.status) {
		case apiStore.statuses.UNCONNECTED:
			return t("app.api_unconnected")
			break

		case apiStore.statuses.CONNECTING:
			return t("app.api_connecting")
			break

		case apiStore.statuses.CONNECTED:
			return t("app.api_connected")
			break

		default:
			return t("app.api_unknown")
	}
})

if (window.electronAPI.nodeEnv != "development") {
	apiStore.init()
}

const views = [
	{
		text: t("app.home"),
		to: "/",
	},
	{
		text: t("app.reports"),
		to: "/report",
	},
	{
		text: t("app.settings"),
		to: "/setting",
	},
	{
		text: t("app.about"),
		to: "/about",
	},
	{
		text: t("app.testpage"),
		to: "/test",
	},
]
</script>
