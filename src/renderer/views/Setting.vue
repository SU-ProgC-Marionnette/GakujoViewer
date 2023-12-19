<template>
	<v-container>
		<div v-for="category in settings ">
			<div class="text-h4">
				{{ category.text }}
			</div>
			<div v-for="item in  category.items ">
				<v-text-field v-bind="item.props" :id="category.id + '.' + item.id">
				</v-text-field>
			</div>
		</div>
		<v-btn>
			保存
		</v-btn>
	</v-container>
</template>

<script>
export default {
	data: () => ({
		settings: [
			{
				text: '認証設定',
				id: 'auth',
				items: [
					{
						id: 'mail',
						component: 'v-text-field',
						props: {
							label: 'メールアドレス',
							'v-model': 'email'
						}
					},
					{
						id: 'password',
						component: 'v-text-field',
						props: {
							label: 'パスワード',
							'v-model': 'password'
						}
					}
				]
			}
		]
	})
}
</script>

