<template>
	<TablePage
		:latestUpdate="latestUpdate"
		:headers="headers"
		:table="table"
		:page="Pages.Report"
	/>
</template>

<script setup>
import Table from "../components/Table.vue"
import TablePage from "../components/TablePage.vue"

import { computed } from "vue"
import { useI18n } from "vue-i18n"

import { useApiStore } from "../stores/apistore"
import { ExpireStatus } from "../../main/data/expirestatus"
import { SubjectType } from "../../main/data/subjecttype"
import { SubmitStatus } from "../../main/data/submitstatus"
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
	{ title: t("table.submit_status"), key: "submit" },
]

const table = computed(() =>
	apiStore.subjectList.map((row) => {
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

			default:
				status = t("expire_status.other")
				break
		}

		let type = ""
		switch (row.type) {
			case SubjectType.Exam:
				type = t("subject_type.exam")
				break

			case SubjectType.Report:
				type = t("subject_type.report")
				break

			case SubjectType.SubjectSurvey:
				type = t("subject_type.subject_survey")
				break

			case SubjectType.SchoolSurvey:
				type = t("subject_type.school_survey")
				break

			case SubjectType.SubjectReview:
				type = t("subject_type.subject_review")
				break

			default:
				type = t("subject_type.other")
				break
		}

		let submit = ""
		switch(row.submit) {
			case SubmitStatus.Submitted:
				submit = t("submit_status.submitted")
				break

			case SubmitStatus.NotSubmitted:
				submit = t("submit_status.not_submitted")
				break

			default:
				submit = t("submit_status.other")
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
	apiStore.subjectListDate != null
		? apiStore.subjectListDate.toLocaleString()
		: t("table.no_data"),
)

function clickHandler(id) {
	apiStore.updateDetails(Pages.Subject, id)
	apiStore.changeDetail(Pages.Subject, id)
}
</script>
