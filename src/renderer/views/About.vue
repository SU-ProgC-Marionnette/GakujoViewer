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
		<div class="text-h4">{{ $t("about.oss_license") }}</div>
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
	</v-container>
</template>

<script setup>
import licenses from "../assets/license.json"
</script>
