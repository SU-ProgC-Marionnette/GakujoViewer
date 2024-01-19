<template>
	<v-data-table-virtual :headers="props.headers" :items="props.data">
		<template v-slot:[`item.title`]="{ item }">
			<span
				class="text-none text-decoration-underline"
				style="cursor: pointer"
				@click="(e) => props.onclick(item.id)"
			>
				{{ item.title }}
			</span>
		</template>
	</v-data-table-virtual>
</template>

<script setup>
const props = defineProps(["headers", "data", "onclick"])
</script>
