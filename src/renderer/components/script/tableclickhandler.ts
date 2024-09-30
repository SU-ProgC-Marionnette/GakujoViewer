import { Pages } from "../../../main/data/pages"

export function tableClickHandler(page: Pages, id: number, apiStore, router): void {
	if (apiStore.status === apiStore.statuses.CONNECTED) {
		apiStore.updateDetails(page, id)
		apiStore.changeDetail(page, id)
		router.push("/detail")
	} else {
		let found = false
		switch (page) {
			case Pages.Subject:
				if (apiStore.subjectDetails[id] !== undefined) {
					found = true
				}
				break

			case Pages.Contact:
				if (apiStore.contactDetails[id] !== undefined) {
					found = true
				}
				break
		}

		if (found) {
			apiStore.changeDetail(page, id)
			router.push("/detail")
		}
	}
}
