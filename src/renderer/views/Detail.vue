<template>
	<v-btn block rounded="0" @click="router.back()">{{
		$t("detail.back")
	}}</v-btn>
	<v-table v-if="data !== false">
		<tbody>
			<tr v-for="datum in data">
				<td>{{ datum.label }}</td>
				<td style="white-space: pre-wrap; overflow-wrap: anywhere">
					{{ datum.value }}
				</td>
			</tr>
		</tbody>
	</v-table>
	<div class="mt-5 text-center" v-if="data === false">
		{{ $t("detail.fetching") }}
	</div>
</template>

<script setup>
import { computed } from "vue"
import { useI18n } from "vue-i18n"
import { useRouter } from "vue-router"

import { useApiStore } from "../stores/apistore"

import { Pages } from "../../main/data/pages"

const { t } = useI18n()
const apiStore = useApiStore()
const router = useRouter()

const data = computed(() => {
	const page = apiStore.showingDetailPage
	const id = apiStore.showingDetailId
	const title = apiStore.showingDetailTitle

	if (page === null || id === null) {
		return false
	}

	switch (page) {
		case Pages.Subject: {
			let detail = null
			if (apiStore.subjectDetails[id] !== undefined && apiStore.subjectDetails[id] !== null) {
				detail = apiStore.subjectDetails[id]
			}

			if (detail === null) {
				return false
			}

			console.log(detail)

			return [
				{ label: t("detail.title"), value: detail.title },
				{
					label: t("detail.submit_period"),
					value: `${detail.expireDate.toLocaleString()}`,
				},
				{
					label: t("detail.review_method"),
					value: detail.reviewMethod,
				},
				{ label: t("detail.description"), value: detail.description },
				{ label: t("detail.reference"), value: detail.reference },
				{ label: t("detail.note"), value: detail.note },
			]
		}

		case Pages.Contact:
			if (apiStore.contactDetails[id] !== undefined && apiStore.contactDetails[id] !== null) {
				let detail = apiStore.contactDetails[id]
				return [
					{ label: t("detail.type"), value: detail.type },
					{ label: t("detail.title"), value: detail.title },
					{ label: t("detail.content"), value: detail.description },
					{ label: t("detail.file"), value: detail.file },
					{
						label: t("detail.file_link_pub"),
						value: detail.fileLinkPub,
					},
					{
						label: t("detail.reference"),
						value: detail.reference_url,
					},
					{ label: t("detail.importance"), value: detail.importance },
					{ label: t("detail.want_reply"), value: detail.wantReply },
				]
			}
			return false

		default:
			return false
	}
})
</script>
