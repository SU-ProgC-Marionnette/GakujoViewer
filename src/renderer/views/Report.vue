<template>
	<v-container>
		<Table :columns="columns" :data="table" />
	</v-container>
</template>

<script setup>
import Table from '../components/Table.vue'
</script>

<script>
export default {
	data: () => ({
		columns: [
			'教科', 'タイトル', '期限'
		],
		table: [
			[
				'testSub', 'testTitle', 'testExpire'
			]
		]
	})
}
</script>

