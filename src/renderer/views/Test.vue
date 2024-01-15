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
			<v-list-item v-for="(data, key) in testButtons">
				<v-btn class="text-none" @click="call(data.fn, data.args)">
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

function call(method, args) {
	this[method](...args)
}

function movePageWrap(page) {
	apiStore.movePage(page)
}

async function printTable() {
	console.log(await apiStore.getTable())
}

function updateReportList() {
	apiStore.updateReportList()
}

function updateContactList() {
	apiStore.updateContactList()
}

function updateExamList() {
	apiStore.updateExamList()
}

testButtons.movePageToReport = {
	fn: "movePageWrap",
	args: [Pages.Report],
}
testButtons.movePageToContact = {
	fn: "movePageWrap",
	args: [Pages.Contact],
}
testButtons.movePageToExam = {
	fn: "movePageWrap",
	args: [Pages.Exam],
}
testButtons.printTable = {
	fn: "printTable",
	args: [],
}
testButtons.updateReportList = {
	fn: "updateReportList",
	args: [],
}
testButtons.updateContactList = {
	fn: "updateContactList",
	args: [],
}
testButtons.updateExamList = {
	fn: "updateExamList",
	args: [],
}
</script>

