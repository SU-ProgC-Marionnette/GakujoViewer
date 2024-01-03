<template>
	<v-app>
		<v-footer app elevation="2">
			<v-btn
				v-if="apiStatus == 'API未接続'"
				class="mr-4"
				density="comfortable"
				color="warning"
				prepend-icon="mdi-reload"
				@click="apiStore.init()"
			>
				{{ $t("app.connect") }}
			</v-btn>
			{{ apiStatus }}
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
