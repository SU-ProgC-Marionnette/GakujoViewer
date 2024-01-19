<template>
	<TablePage
		:latestUpdate="latestUpdate"
		:headers="headers"
		:table="table"
		:page="Pages.Contact"
	/>
</template>

<script setup>
import Table from "../components/Table.vue"
import TablePage from "../components/TablePage.vue"

import { computed } from "vue"
import { useI18n } from "vue-i18n"

import { useApiStore } from "../stores/apistore"

import { ContactType } from "../../main/data/contacttype"
import { Pages } from "../../main/data/pages"

const { t } = useI18n()
const apiStore = useApiStore()

const headers = [
	{ title: t("table.subject"), key: "subject" },
	{ title: t("table.title"), key: "title" },
	{ title: t("table.staff"), key: "staff" },
	{ title: t("table.type"), key: "type" },
	{ title: t("table.date"), key: "date" },
	{ title: t("table.target_date"), key: "targetDate" },
]

const table = computed(() =>
	apiStore.contactList.map((row) => {
		let type = ""
		switch (row.type) {
			case ContactType.staff:
				type = t("contact_type.staff")
				break
		}

		let dateStr = ""
		if (row.date != null) {
			dateStr = row.date.toLocaleString()
		}

		let targetDateStr = ""
		if (row.targetDate != null) {
			targetDateStr = row.targetDate.toLocaleString()
		}

		return {
			id: row.id,
			subject: row.subject,
			title: row.title,
			staff: row.staff,
			type: type,
			date: dateStr,
			targetDate: targetDateStr,
		}
	}),
)

const latestUpdate = computed(() =>
	apiStore.contactListDate != null
		? apiStore.contactListDate.toLocaleString()
		: t("table.no_data"),
)
</script>
