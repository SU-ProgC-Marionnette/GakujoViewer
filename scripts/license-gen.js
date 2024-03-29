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

				if(licenseText == '') {
					console.log(`${name}: no license file`)
				}

				if(pack.licenses == 'UNKNOWN') {
					console.log(`${name}: UNKNOWN license`)
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

			output.sort((a, b) => (a.license < b.license ? -1 : 1))

			let outputArray = [
				'NOTICES',
				'',
				'This application contains following third party softwares:',
				'',
			]

			for(const license of output) {
				outputArray.push('-'.repeat(60))
				outputArray.push('')
				outputArray.push(license.license)
				outputArray.push('')
				outputArray = outputArray.concat(
					license.packages.map(pack => `${pack[0]} (${pack[1]})`)
				)
				outputArray.push('')
				outputArray.push(license.licenseText)
			}

			writeFileSync(
				path.join(__dirname, '..', 'src', 'renderer', 'assets', 'license.json'),
				JSON.stringify(output)
			)

			writeFileSync(
				path.join(__dirname, '..', 'ThirdPartyLicense.txt'),
				outputArray.join('\n')
			)
		}
	}
)
