import { StringUtil } from './stringutil'

import { TableData } from '../data/tabledata'
import { ReportData } from '../data/reportdata'
import { ContactData } from '../data/contactdata'
import { ExamData } from '../data/examdata'

import { ExpireStatus } from '../data/expirestatus'
import { SubmitStatus } from '../data/submitstatus'
import { ContactType } from '../data/contacttype'
import { SubmitType } from '../data/submittype'

export class DataUtil {
	public static toDataList(table: TableData[]): ReportData[] | ContactData[] | ExamData[] {
		const reportKeyword = '最終提出'
		const contactKeyword = '連絡'
		const examKeyword = '提出状況'

		// ヘッダでtableを判別
		if(DataUtil.hasKeyword(table[0].cells, reportKeyword)) {
			return DataUtil.toReportList(table)
		} else if(DataUtil.hasKeyword(table[0].cells, contactKeyword)) {
			return DataUtil.toContactList(table)
		} else if(DataUtil.hasKeyword(table[0].cells, examKeyword)) {
			return DataUtil.toExamList(table)
		} else {
			return []
		}
	}

	private static toReportList(table: TableData[]): ReportData[] {
		const result: ReportData[] = []
		const data: TableData[] = table.filter(
			datum => datum.cells[0] != '授業科目\n学期/曜日時限'
		) // ヘッダを除く

		for(const datum of data) {
			const expireArr = StringUtil.toDateArray(datum.cells[3])
			let startDate: Date | null = null
			let expireDate: Date | null = null
			if(expireArr != null && expireArr.length == 2) {
				startDate = expireArr[0]
				expireDate = expireArr[1]
			}

			const submitDateArr = StringUtil.toDateArray(datum.cells[4])
			let submitDate: Date | null = null
			if(submitDateArr != null) {
				submitDate = submitDateArr[0]
			}

			result.push(
				new ReportData(
					datum.id,
					datum.cells[0],
					datum.cells[1],
					DataUtil.toExpireStatus(datum.cells[2]),
					startDate,
					expireDate,
					DataUtil.toSubmitType(datum.cells[5]),
					submitDate
				)
			)
		}

		return result
	}

	private static toContactList(table: TableData[]): ContactData[] {
		const result: ContactData[] = []
		const data: TableData[] = table.filter(
			datum => datum.cells[0] != '授業科目\n学期/曜日時限'
		) // ヘッダを除く

		for(const datum of data) {
			const dateArr = StringUtil.toDateArray(datum.cells[5])
			let date: Date | null = null
			if(dateArr != null) {
				date = dateArr[0]
			}

			const targetDateArr = StringUtil.toDateArray(datum.cells[4])
			let targetDate: Date | null = null
			if(targetDateArr != null) {
				targetDate = targetDateArr[0]
			}

			result.push(
				new ContactData(
					datum.id,
					datum.cells[0],
					StringUtil.getBody(datum.cells[2]),
					datum.cells[1],
					DataUtil.toContactType(datum.cells[3]),
					date,
					targetDate,
					StringUtil.isRead(datum.cells[2]),
					StringUtil.isImportant(datum.cells[3])
				)
			)
		}

		return result
	}

	private static toExamList(table: TableData[]): ExamData[] {
		const result: ExamData[] = []
		const data: TableData[] = table.filter(
			datum => datum.cells[0] != '授業科目\n学期/曜日時限'
		) // ヘッダを除く

		for(const datum of data) {
			const expireArr = StringUtil.toDateArray(datum.cells[3])
			let startDate: Date | null = null
			let expireDate: Date | null = null
			if(expireArr != null && expireArr.length == 2) {
				startDate = expireArr[0]
				expireDate = expireArr[1]
			}


			result.push(
				new ExamData(
					datum.id,
					datum.cells[0],
					datum.cells[1],
					DataUtil.toExpireStatus(datum.cells[2]),
					startDate,
					expireDate,
					DataUtil.toSubmitType(datum.cells[5]),
					DataUtil.toSubmitStatus(datum.cells[4])
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

	private static hasKeyword(array: (number | string)[], keyword: string): boolean {
		return array.some(str => {
			if(typeof str != 'string') {
				return false
			}

			return str.indexOf(keyword) != -1
		})
	}
}
