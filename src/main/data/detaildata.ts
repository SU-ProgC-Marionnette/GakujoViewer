export class DetailData {
	public title: string
	public date: Date | null
	public description: string
	public reference: string

	constructor(title: string, date: Date | null, description: string, reference: string) {
		this.title = title
		this.date = date
		this.description = description
		this.reference = reference
	}
}

export class ExpireDetailData extends DetailData {
	public expireDate: Date | null
	public reviewMethod: string
	public note: string

	constructor(title: string, date: Date | null, expireDate: Date | null, reviewMethod: string, description: string, reference: string, note: string) {
		super(title, date, description, reference)
		this.expireDate = expireDate
		this.reviewMethod = reviewMethod
		this.note = note
	}
}

export class ContactDetailData extends DetailData {
	public type: string
	public file: string
	public fileLinkPub: string
	public importance: string
	public wantReply: string

	constructor(title: string, date: Date | null, type: string, file: string, fileLinkPub: string, description: string, reference: string, importance: string, wantReply: string) {
		super(title, date, description, reference)
		this.type = type
		this.file = file
		this.fileLinkPub = fileLinkPub
		this.importance = importance
		this.wantReply = wantReply
	}
}
