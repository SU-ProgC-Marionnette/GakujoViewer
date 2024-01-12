import { StringUtil } from './stringutil'

import { ReportData } from '../data/reportdata'
import { ContactData } from '../data/contactdata'
import { ExamData } from '../data/examdata'

import { ExpireStatus } from '../data/expirestatus'
import { SubmitStatus } from '../data/submitstatus'
import { ContactType } from '../data/contacttype'
import { SubmitType } from '../data/submittype'

export class DataUtil {
	public static toDataList(table: string[][]): ReportData[] | ContactData[] | ExamData[] {
		const reportKeyword = '最終提出'
		const contactKeyword = '連絡'
		const examKeyword = '提出状況'

		// ヘッダでtableを判別
		if(DataUtil.hasKeyword(table[0], reportKeyword)) {
			return DataUtil.toReportList(table)
		} else if(DataUtil.hasKeyword(table[0], contactKeyword)) {
			return DataUtil.toContactList(table)
		} else if(DataUtil.hasKeyword(table[0], examKeyword)) {
			return DataUtil.toExamList(table)
		} else {
			return []
		}
	}

	private static toReportList(table: string[][]): ReportData[] {
		const result: ReportData[] = []
		const data: string[][] = table.slice(1) // ヘッダを除く

		for(const datum of data) {
			const expireArr = StringUtil.toDateArray(datum[3])
			let startDate: Date | null = null
			let expireDate: Date | null = null
			if(expireArr != null && expireArr.length == 2) {
				startDate = expireArr[0]
				expireDate = expireArr[1]
			}

			const submitDateArr = StringUtil.toDateArray(datum[4])
			let submitDate: Date | null = null
			if(submitDateArr != null) {
				submitDate = submitDateArr[0]
			}

			result.push(
				new ReportData(
					datum[0],
					datum[1],
					DataUtil.toExpireStatus(datum[2]),
					startDate,
					expireDate,
					DataUtil.toSubmitType(datum[5]),
					submitDate
				)
			)
		}

		return result
	}

	private static toContactList(table: string[][]): ContactData[] {
		const result: ContactData[] = []
		const data: string[][] = table.slice(1) // ヘッダを除く

		for(const datum of data) {
			const dateArr = StringUtil.toDateArray(datum[5])
			let date: Date | null = null
			if(dateArr != null) {
				date = dateArr[0]
			}

			const targetDateArr = StringUtil.toDateArray(datum[4])
			let targetDate: Date | null = null
			if(targetDateArr != null) {
				targetDate = targetDateArr[0]
			}

			result.push(
				new ContactData(
					datum[0],
					StringUtil.getBody(datum[2]),
					datum[1],
					DataUtil.toContactType(datum[3]),
					date,
					targetDate,
					StringUtil.isRead(datum[2]),
					StringUtil.isImportant(datum[3])
				)
			)
		}

		return result
	}

	private static toExamList(table: string[][]): ExamData[] {
		const result: ExamData[] = []
		const data: string[][] = table.slice(1) // ヘッダを除く

		for(const datum of data) {
			const expireArr = StringUtil.toDateArray(datum[3])
			let startDate: Date | null = null
			let expireDate: Date | null = null
			if(expireArr != null && expireArr.length == 2) {
				startDate = expireArr[0]
				expireDate = expireArr[1]
			}


			result.push(
				new ExamData(
					datum[0],
					datum[1],
					DataUtil.toExpireStatus(datum[2]),
					startDate,
					expireDate,
					DataUtil.toSubmitType(datum[5]),
					DataUtil.toSubmitStatus(datum[4])
				)
			)
		}

		return result
	}

	private static toContactType(str: string): ContactType {
		switch(str) {
			case '教員連絡':
				return ContactType.staff

			default:
				return ContactType.other
		}
	}

	private static toSubmitType(str: string): SubmitType {
		switch(str) {
			case 'Web':
				return SubmitType.Web

			default:
				return SubmitType.other
		}
	}

	private static toSubmitStatus(str: string): SubmitStatus {
		switch(str) {
			case '提出済':
				return SubmitStatus.Submitted

			case '未提出':
				return SubmitStatus.NotSubmitted

			default:
				return SubmitStatus.other
		}
	}

	private static toExpireStatus(str: string): ExpireStatus {
		switch(str) {
			case '受付中':
				return ExpireStatus.Accepting
				break

			case '締切':
				return ExpireStatus.Closed
				break

			case '提出済':
				return ExpireStatus.Submitted

			default:
				return ExpireStatus.other
		}
	}

	private static hasKeyword(array: string[], keyword: string): boolean {
		return array.some(str => str.indexOf(keyword) != -1)
	}
}
