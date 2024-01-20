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
import { useRouter } from "vue-router"

import Table from "./Table.vue"
import { useApiStore } from "../stores/apistore"
import { tableClickHandler } from "./script/tableclickhandler"

import { Pages } from "../../main/data/pages"

const apiStore = useApiStore()
const router = useRouter()

const props = defineProps(["latestUpdate", "headers", "table", "page"])

function clickHandler(id) {
	tableClickHandler(props.page, id, apiStore, router)
}
</script>
