<template>
	<v-navigation-drawer app permanent elevation="2">
		<v-list>
			<v-list-item v-for="(view, i) in views" :key="i" :value="view" :to="view.to">
				<v-list-item-title v-text="view.text"></v-list-item-title>
			</v-list-item>
		</v-list>
	</v-navigation-drawer>
</template>

<script setup>
import { useI18n } from "vue-i18n"

const { t } = useI18n()

let views = [
	{
		text: t("app.home"),
		to: "/",
	},
	{
		text: t("app.reports"),
		to: "/report",
	},
	{
		text: t("app.contacts"),
		to: "/contact",
	},
	{
		text: t("app.exams"),
		to: "/exam",
	},
	/*
	{
		text: t("app.settings"),
		to: "/setting",
	},
	*/
	{
		text: t("app.about"),
		to: "/about",
	},
]

if (window.electronAPI.nodeEnv == "development") {
	views.push({
		text: t("app.testpage"),
		to: "/test",
	})
}
</script>
