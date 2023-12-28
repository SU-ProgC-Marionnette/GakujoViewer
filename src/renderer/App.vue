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
				接続する
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
import { useApiStore } from "./stores/apistore"

const apiStore = useApiStore()

const apiStatus = computed(() => apiStore.status)

if (window.electronAPI.nodeEnv != "development") {
	apiStore.init()
}

const views = [
	{
		text: "ホーム",
		to: "/",
	},
	{
		text: "レポート一覧",
		to: "/report",
	},
	{
		text: "設定",
		to: "/setting",
	},
	{
		text: "このアプリについて",
		to: "/about",
	},
	{
		text: "テストページ",
		to: "/test",
	},
]
</script>
