<template>
	<v-container>
		<div>{{ $t("table.latest_update", { date: lastUpdate }) }}</div>
		<div class="text-h4 mt-5">{{ $t("top.task_accepting") }}</div>
		<v-table>
			<thead>
				<tr>
					<th></th>
					<th>{{ $t("table.subject") }}</th>
					<th>{{ $t("table.title") }}</th>
					<th>{{ $t("table.expire") }}</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="row in taskAccTable" :key="row.title">
					<td>{{ row.name }}</td>
					<td>{{ row.subject }}</td>
					<td>
						<span
							class="text-none text-decoration-underline"
							style="cursor: pointer"
							@click="(e) => clickHandler(row.page, row.id)"
						>
							{{ row.title }}
						</span>
					</td>
					<td>{{ row.expire }}</td>
				</tr>
			</tbody>
		</v-table>

		<div class="text-h4 mt-5">{{ $t("top.task_expired") }}</div>
		<v-table>
			<thead>
				<tr>
					<th></th>
					<th>{{ $t("table.subject") }}</th>
					<th>{{ $t("table.title") }}</th>
					<th>{{ $t("table.expire") }}</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="row in taskExpTable" :key="row.title">
					<td>{{ row.name }}</td>
					<td>{{ row.subject }}</td>
					<td>
						<span
							class="text-none text-decoration-underline"
							style="cursor: pointer"
							@click="(e) => clickHandler(row.page, row.id)"
						>
							{{ row.title }}
						</span>
					</td>
					<td>{{ row.expire }}</td>
				</tr>
			</tbody>
		</v-table>

		<div class="text-h4 mt-5">{{ $t("top.unread_contact") }}</div>
		<v-table>
			<thead>
				<tr>
					<th>{{ $t("table.date") }}</th>
					<th>{{ $t("table.subject") }}</th>
					<th>{{ $t("table.title") }}</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="row in unreadContactTable" :key="row.title">
					<td>{{ row.date }}</td>
					<td>{{ row.subject }}</td>
					<td>
						<span
							class="text-none text-decoration-underline"
							style="cursor: pointer"
							@click="(e) => clickHandler(row.page, row.id)"
						>
							{{ row.title }}
						</span>
					</td>
				</tr>
			</tbody>
		</v-table>
	</v-container>
</template>

<script setup>
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"

import { useApiStore } from "../stores/apistore"
import { tableClickHandler } from "../components/script/tableclickhandler"

import { ExpireStatus } from "../../main/data/expirestatus"
import { SubmitStatus } from "../../main/data/submitstatus"
import { SubjectType } from "../../main/data/subjecttype"
import { Pages } from "../../main/data/pages"

const { t } = useI18n()
const router = useRouter()
const apiStore = useApiStore()

const subjectTypeLangs = {
	[SubjectType.Exam]: t("subject_type.exam"),
	[SubjectType.Report]: t("subject_type.report"),
	[SubjectType.SubjectSurvey]: t("subject_type.subject_survey"),
	[SubjectType.SchoolSurvey]: t("subject_type.school_survey"),
	[SubjectType.SubjectReview]: t("subject_type.subject_review"),
	[SubjectType.Other]: t("subject_type.other")
}

const lastUpdate = computed(() => {
	if (apiStore.subjectListDate === null) {
		// データがない
		return t("table.no_data")
	} else {
		return apiStore.subjectListDate.toLocaleString()
	}
})

const taskAccTable = computed(() => {
	// 未提出で受付中の課題を抽出
	let result = apiStore.subjectList.filter((row) =>
		row.status === ExpireStatus.Accepting
	).map((row) => {
		row.page = Pages.Subject
		row.name = subjectTypeLangs[row.type]

		return row
	})

	// 期限が近い順にソート
	result.sort((a, b) => {
		if (a.expire === b.expire) {
			return 0
		} else if (a.expire === null) {
			return 1
		} else if (b.expire === null) {
			return -1
		} else {
			return a.expire > b.expire ? 1 : -1
		}
	})

	// 日付を文字列に変換
	result = result.map((row) => {
		row.expire = row.expire.toLocaleString()
		return row
	})

	return result
})

const taskExpTable = computed(() => {
	// 期限切れの課題を抽出
	const now = new Date()
	let result = apiStore.subjectList.filter((row) =>
		row.status === ExpireStatus.Closed && row.submit === null
	).map((row) => {
		row.page = Pages.Subject
		row.name = subjectTypeLangs[row.type]
		return row
	})

	// 期限が新しい順にソート
	result.sort((a, b) => {
		if (a.expire === b.expire) {
			return 0
		} else if (a.expire === null) {
			return 1
		} else if (b.expire === null) {
			return -1
		} else {
			return a.expire < b.expire ? 1 : -1
		}
	})

	// 日付を文字列に変換
	result = result.map((row) => {
		row.expire = row.expire.toLocaleString()
		return row
	})

	return result
})

const unreadContactTable = computed(() => {
	return apiStore.contactList
		.filter((row) => row.read)
		.map((row) => {
			row.page = Pages.Contact
			row.date = row.date.toLocaleString()
			return row
		})
})

function clickHandler(page, id) {
	tableClickHandler(page, id, apiStore, router)
}
</script>
