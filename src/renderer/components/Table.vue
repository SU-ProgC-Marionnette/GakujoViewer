<template>
	<v-data-table-virtual :headers="props.headers" :items="props.data">
		<template v-slot:[`item.title`]="{ item }">
			<router-link to="/detail" @click="(e) => props.onclick(item.id)">
				{{ item.title }}
			</router-link>
		</template>
	</v-data-table-virtual>
</template>

<script setup>
const props = defineProps(["headers", "data", "onclick"])
</script>
