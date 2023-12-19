<template>
	<v-table>
		<thead>
			<tr>
				<th v-for="column in columns">{{ column }}</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="row in data">
				<td v-for="item in row">{{ item }}</td>
			</tr>
		</tbody>
	</v-table>
</template>

<script>
export default {
	props: [
		'columns',
		'data'
	]
}
</script>

