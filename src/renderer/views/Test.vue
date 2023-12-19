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

// testVars.[任意の名前]に代入することで表示される
testVars.testInput = "sample input"
testVars.testOutput = strUtil.testFunction(testVars.testInput)
testVars.foo = "foo string"

export default {
	data: () => ({
		testVars: testVars,
	}),
}
</script>
