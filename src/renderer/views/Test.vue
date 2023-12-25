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
	</v-container>
</template>

<script setup>
import { StringUtil } from "../../main/util/stringutil"
import { computed } from "vue"
import { useApiStore } from "../stores/apistore"

const apiStore = useApiStore()

const strUtil = new StringUtil()
let testVars = {}

// testVars.[任意の名前]に代入することで表示される
testVars.testInput = "sample input"
testVars.foo = "foo string"

testVars.title = computed(() => apiStore.title)
</script>
