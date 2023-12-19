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

<script>
import { StringUtil } from "../../main/util/stringutil"

const strUtil = new StringUtil()
let testVars = {}

let testInput = "sample input"

// testVars.[任意の名前]に代入することで表示される
testVars.testOutput = strUtil.testFunction(testInput)
testVars.foo = "foo string"

export default {
	data: () => ({
		testVars: testVars,
	}),
}
</script>
