<template>
	<TablePage
		:latestUpdate="latestUpdate"
		:headers="headers"
		:table="table"
		:page="Pages.Exam"
	/>
</template>

<script setup>
import Table from "../components/Table.vue"
import TablePage from "../components/TablePage.vue"

import { computed } from "vue"
import { useI18n } from "vue-i18n"

import { useApiStore } from "../stores/apistore"
import { ExpireStatus } from "../../main/data/expirestatus"
import { SubmitStatus } from "../../main/data/submitstatus"
import { SubmitType } from "../../main/data/submittype"
import { Pages } from "../../main/data/pages"

const { t } = useI18n()
const apiStore = useApiStore()

const headers = [
	{ title: t("table.subject"), key: "subject" },
	{ title: t("table.title"), key: "title" },
	{ title: t("table.status"), key: "status" },
	{ title: t("table.start"), key: "start" },
	{ title: t("table.expire"), key: "expire" },
	{ title: t("table.type"), key: "type" },
	{ title: t("table.submit"), key: "submit" },
]

const table = computed(() =>
	apiStore.examList.map((row) => {
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

		let submit = ""
		switch (row.submit) {
			case SubmitStatus.Submitted:
				submit = t("submit_status.submitted")
				break

			case SubmitStatus.NotSubmitted:
				submit = t("submit_status.not_submitted")
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

		return {
			id: row.id,
			subject: row.subject,
			title: row.title,
			status: status,
			start: startStr,
			expire: expireStr,
			type: type,
			submit: submit,
		}
	}),
)

const latestUpdate = computed(() =>
	apiStore.examListDate != null
		? apiStore.examListDate.toLocaleString()
		: t("table.no_data"),
)

function clickHandler(id) {
	apiStore.updateDetails(Pages.Exam, id)
	apiStore.changeDetail(Pages.Exam, id)
}
</script>
