const path = require('path');
const { readFileSync, writeFileSync } = require('node:fs')
const checker = require('license-checker')

checker.init(
	{
		start: path.join(__dirname, '..'),
		production: true,
		unknown: true
	},
	(err, packages) => {
		if(err) {
			console.error(err)
		} else {
			let output = []
			// output structure example:
			//	[
			//		{
			//			license: 'MIT',
			//			licenseText: 'contents of license file',
			//			packages: [ // packages which have same license text
			//				['package name', 'repository']
			//			]
			//		},
			//	]

			for(const [name, pack] of Object.entries(packages)) {
				// find same license text
				let licenseText = ''
				if(pack.licenseFile != undefined) {
					try {
						licenseText = readFileSync(pack.licenseFile, {encoding: 'utf8'})
					} catch(err) {
						console.error(`${pack.licenseFile} is not accessable.`)
						console.error(err)
					}
				}

				const index = output.findIndex(obj => obj.licenseText == licenseText)

				if(index == -1) {
					output.push({
						license: pack.licenses,
						licenseText: licenseText,
						packages: [
							[name, pack.repository]
						]
					})
				} else {
					output[index].packages.push([
						name, pack.repository
					])
				}
			}

			writeFileSync(
				path.join(__dirname, '..', 'src', 'renderer', 'assets', 'license.json'),
				JSON.stringify(output)
			)
		}
	}
)
