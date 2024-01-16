<template>
	<v-container>
		<v-list>
			<v-list-item v-for="(value, key) in testVars">
				<template v-slot:prepend>
					{{ key }}
				</template>
				<template v-slot:append>
					{{ value }}
				</template>
			</v-list-item>
		</v-list>
		<v-list>
			<v-list-item v-for="(fn, key) in testButtons">
				<v-btn class="text-none" @click="fn">
					{{ key }}
				</v-btn>
			</v-list-item>
		</v-list>
	</v-container>
</template>

<script setup>
import { StringUtil } from "../../main/util/stringutil"
import { computed } from "vue"
import { useApiStore } from "../stores/apistore"
import { Pages } from "../../main/data/pages"

const apiStore = useApiStore()

const strUtil = new StringUtil()
let testVars = {}
let testButtons = {}

// testVars.[任意の名前]に代入することで表示される
testVars.testInput = "sample input"
testVars.foo = "foo string"

testVars.title = computed(() => apiStore.title)

testButtons.movePageToReport = () => {
	apiStore.movePage(Pages.Report)
}
testButtons.movePageToContact = () => {
	apiStore.movePage(Pages.Contact)
}
testButtons.movePageToExam = () => {
	apiStore.movePage(Pages.Exam)
}
testButtons.printTable = async () => {
	console.log(await apiStore.getTable())
}
testButtons.updateReportList = () => {
	apiStore.updateReportList()
}
testButtons.updateContactList = () => {
	apiStore.updateContactList()
}
testButtons.updateExamList = () => {
	apiStore.updateExamList()
}
</script>
