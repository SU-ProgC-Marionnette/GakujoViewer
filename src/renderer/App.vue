<template>
	<v-app>
		<v-navigation-drawer permanent absolute>
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

<script>
window.electronAPI.initApi()

export default {
	data: () => ({
		views: [
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
		],
	}),
}
</script>
