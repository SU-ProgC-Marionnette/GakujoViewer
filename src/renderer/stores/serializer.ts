import { StateTree } from 'pinia'

export function stringify(stateTree: StateTree): string {
	return JSON.stringify(stateTree)
}

export function parse(jsonStr: string): StateTree {
	return JSON.parse(
		jsonStr,
		(key, value) => {
			if(typeof value === 'string' && /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value)) {
				return new Date(value)
			} else {
				return value
			}
		}
	)
}
