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
		<div class="text-h4">オープンソースライセンス</div>
		<v-expansion-panels variant="accordion">
			<v-expansion-panel
				v-for="(license, index) in licenses"
				:key="index"
			>
				<v-expansion-panel-title>
					{{ license.license }}
					({{ license.packages.length }} softwares)
				</v-expansion-panel-title>
				<v-expansion-panel-text>
					このアプリケーションには次のソフトウェアが含まれています:
					<ul class="pl-10">
						<li v-for="pack in license.packages">
							{{ pack[0] }}
							(<a :href="pack[1]">{{ pack[1] }}</a
							>)
						</li>
					</ul>
					これらのソフトウェアには次の文書やライセンスが含まれています:
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
