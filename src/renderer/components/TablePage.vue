<template>
	<v-container>
		<div>{{ $t("table.latest_update", { date: props.latestUpdate }) }}</div>
		<Table
			:headers="props.headers"
			:data="props.table"
			:onclick="clickHandler"
		/>
	</v-container>
</template>

<script setup>
import { computed } from "vue"

import Table from "./Table.vue"
import { useApiStore } from "../stores/apistore"

const apiStore = useApiStore()

const props = defineProps(["latestUpdate", "headers", "table", "page"])

function clickHandler(id) {
	apiStore.updateDetails(props.page, id)
	apiStore.changeDetail(props.page, id)
}
</script>
