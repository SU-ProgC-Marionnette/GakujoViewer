<template>
	<v-data-table-virtual :headers="headers" :items="data"></v-data-table-virtual>
</template>

<script>
export default {
	props: [
		'headers',
		'data'
	]
}
</script>




