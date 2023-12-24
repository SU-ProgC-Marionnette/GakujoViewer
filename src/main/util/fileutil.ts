import { writeFile, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { app } from 'electron'

export class FileUtil {
	// file names
	private static _LOGIN_COOKIE: string

	public static init(): void {
		const userDataPath: string = app.getPath('userData')

		this._LOGIN_COOKIE = join(userDataPath, 'login_cookie.dat')
	}

	public static async write(file: string, data: string): Promise<boolean> {
		try {
			await writeFile(file, data)

			return true
		} catch(err) {
			console.error(err)

			return false
		}
	}

	public static async read(file: string): Promise<string> {
		try {
			const content = await readFile(file, { encoding: 'utf8' })

			return content
		} catch(err) {
			console.error(err)

			return ''
		}
	}

	public static get LOGIN_COOKIE(): string {
		return this._LOGIN_COOKIE
	}
}

FileUtil.init()
