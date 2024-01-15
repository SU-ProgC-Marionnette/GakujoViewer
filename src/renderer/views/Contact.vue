<template>
	<v-container>
		<div>{{ $t('table.latest_update', { date: latestUpdate }) }}</div>
		<Table :columns="columns" :data="table" />
	</v-container>
</template>

<script setup>
import Table from "../components/Table.vue"

import { computed } from "vue"
import { useI18n } from "vue-i18n"

import { useApiStore } from "../stores/apistore"
import { ContactType } from "../../main/data/contacttype"

const { t } = useI18n()
const apiStore = useApiStore()

const columns = [
	t("table.subject"),
	t("table.title"),
	t("table.staff"),
	t("table.type"),
	t("table.date"),
	t("table.target_date"),
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

		return [row.subject, row.title, row.staff, type, dateStr, targetDateStr]
	}),
)

const latestUpdate = computed(() =>
	apiStore.contactListDate != null ?
		apiStore.contactListDate.toLocaleString() :
		t('table.no_data')
)
</script>

