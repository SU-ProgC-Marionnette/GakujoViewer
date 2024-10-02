<style>
code {
	display: block;
	white-space: pre;
	font-family:
		ui-monospace,
		SFMono-Regular,
		SF Mono,
		Menlo,
		Consolas,
		Liberation Mono,
		monospace;
	overflow-x: scroll;
}
</style>

<template>
	<v-container>
		<v-row>
			<v-col cols="4">
				<v-img :src="icon"></v-img>
			</v-col>
			<v-col>
				<div class="text-h4">GakujoViewer</div>
				<div class="ml-5">
					<div class="text-h6">v{{ version }}</div>
					<div class="mt-5">2024 (C) SU-ProgC-Marionnette</div>
					<div class="ml-5">
						https://github.com/SU-ProgC-Marionnette/GakujoViewer
					</div>
				</div>
			</v-col>
		</v-row>
		<v-row>
			<v-col>
				<v-btn @click="clearCache">
					{{ $t("about.clear_cache") }}
				</v-btn>
			</v-col>
		</v-row>
		<v-expansion-panels>
			<v-expansion-panel
				:title="$t('about.oss_license')"
				class="mt-5"
				variant="accordion"
			>
				<v-expansion-panel-text>
					<v-expansion-panels variant="accordion">
						<v-expansion-panel
							v-for="(license, index) in licenses"
							:key="index"
						>
							<v-expansion-panel-title>
								{{
									$t("about.license_title", {
										name: license.license,
										num: license.packages.length,
									})
								}}
							</v-expansion-panel-title>
							<v-expansion-panel-text>
								{{ $t("about.this_app_contains") }}
								<ul class="pl-10">
									<li v-for="pack in license.packages">
										{{ pack[0] }}
										(<a :href="pack[1]">{{ pack[1] }}</a
										>)
									</li>
								</ul>
								{{ $t("about.this_software_contains") }}
								<code class="ml-4">
									{{ license.licenseText }}
								</code>
							</v-expansion-panel-text>
						</v-expansion-panel>
					</v-expansion-panels>
				</v-expansion-panel-text>
			</v-expansion-panel>
		</v-expansion-panels>
	</v-container>
</template>

<script setup>
import { useApiStore } from "../stores/apistore"

import licenses from "../assets/license.json"
import icon from "../../main/static/resources/icon.png"

const version = APP_VERSION

const apiStore = useApiStore()

function clearCache() {
	apiStore.subjectList = []
	apiStore.contactList = []
	apiStore.subjectListDate = null
	apiStore.contactListDate = null
	apiStore.subjectDetails = {}
	apiStore.contactDetails = {}
	apiStore.showingDetailPage = null
	apiStore.showingDetailId = null
	apiStore.showingDetailTitle = null
}
</script>
