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
import { ExpireStatus } from "../../main/data/expirestatus"
import { SubmitType } from "../../main/data/submittype"

const { t } = useI18n()
const apiStore = useApiStore()

const columns = [
	t("table.subject"),
	t("table.title"),
	t("table.status"),
	t("table.start"),
	t("table.expire"),
	t("table.type"),
	t("table.submit_date"),
]

const table = computed(() =>
	apiStore.reportList.map((row) => {
		let status = ""
		switch (row.status) {
			case ExpireStatus.Accepting:
				status = t("expire_status.accepting")
				break

			case ExpireStatus.Submitted:
				status = t("expire_status.submitted")
				break

			case ExpireStatus.Closed:
				status = t("expire_status.closed")
				break
		}

		let type = ""
		switch (row.type) {
			case SubmitType.Web:
				type = t("submit_type.web")
				break
		}

		let startStr = ""
		if (row.start != null) {
			startStr = row.start.toLocaleString()
		}

		let expireStr = ""
		if (row.expire != null) {
			expireStr = row.expire.toLocaleString()
		}

		let submitStr = ""
		if (row.submit != null) {
			submitStr = row.submit.toLocaleString()
		}

		return [
			row.subject,
			row.title,
			status,
			startStr,
			expireStr,
			type,
			submitStr,
		]
	}),
)

const latestUpdate = computed(() =>
	apiStore.reportListDate != null ?
		apiStore.reportListDate.toLocaleString() :
		t('table.no_data')
)
</script>

