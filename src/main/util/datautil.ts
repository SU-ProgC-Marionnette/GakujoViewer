import { StringUtil } from './stringutil'

import { TableData } from '../data/tabledata'
import { SubjectData } from '../data/subjectdata'
import { ContactData } from '../data/contactdata'

import { ExpireStatus } from '../data/expirestatus'
import { SubmitStatus } from '../data/submitstatus'
import { ContactType } from '../data/contacttype'
import { SubjectType } from '../data/subjecttype'

export class DataUtil {
	public static toDataList(table: TableData[]): SubjectData[] | ContactData[] {
		if (table.length == 0) {
			return []
		}

		const noDataKeyword = '表示する情報はありません。'
		const subjectKeyword = '提出物種別'
		const contactKeyword = '連絡'

		// ヘッダでtableを判別
		if(table.length > 1 && DataUtil.hasKeyword(table[1].cells, noDataKeyword)) {
			return []
		} else if(DataUtil.hasKeyword(table[0].cells, subjectKeyword)) {
			return DataUtil.toSubjectList(table)
		} else if(DataUtil.hasKeyword(table[0].cells, contactKeyword)) {
			return DataUtil.toContactList(table)
		} else {
			return []
		}
	}

	private static toSubjectList(table: TableData[]): SubjectData[] {
		const result: SubjectData[] = []
		const data: TableData[] = table.filter(
			datum => datum.cells[0] != '提出物種別'
		) // ヘッダを除く

		for(const datum of data) {
			const expireArr = StringUtil.toDateArray(datum.cells[4])
			let startDate: Date | null = null
			let expireDate: Date | null = null
			if(expireArr != null && expireArr.length == 2) {
				startDate = expireArr[0]
				expireDate = expireArr[1]
			}

			result.push(
				new SubjectData(
					datum.id,
					datum.cells[1],
					datum.cells[2],
					DataUtil.toExpireStatus(datum.cells[3]),
					startDate,
					expireDate,
					DataUtil.toSubmitStatus(datum.cells[5]),
					DataUtil.toSubjectType(datum.cells[0])
				)
			)
		}

		return result
	}

	private static toContactList(table: TableData[]): ContactData[] {
		const result: ContactData[] = []
		const data: TableData[] = table.filter(
			datum => datum.cells[1] != '連絡種別（カテゴリ）'
		) // ヘッダを除く

		for(const datum of data) {
			const dateArr = StringUtil.toDateArray(datum.cells[6])
			let date: Date | null = null
			if(dateArr != null) {
				date = dateArr[0]
			}

			const targetDateArr = StringUtil.toDateArray(datum.cells[5])
			let targetDate: Date | null = null
			if(targetDateArr != null) {
				targetDate = targetDateArr[0]
			}

			result.push(
				new ContactData(
					datum.id,
					datum.cells[3],
					datum.cells[2],
					DataUtil.toContactType(datum.cells[1]),
					date,
					targetDate,
					false,
					false
				)
			)
		}

		return result
	}

	private static toContactType(str: string): ContactType {
		switch(str) {
			case '教員連絡':
				return ContactType.Staff

			case '学内連絡(共通)':
				return ContactType.Common

			default:
				return ContactType.Other
		}
	}

	private static toSubmitStatus(str: string): SubmitStatus {
		switch(str) {
			case '提出済':
				return SubmitStatus.Submitted

			case '未提出':
				return SubmitStatus.NotSubmitted

			default:
				return SubmitStatus.Other
		}
	}

	private static toExpireStatus(str: string): ExpireStatus {
		switch(str) {
			case '受付中':
				return ExpireStatus.Accepting

			case '締切':
				return ExpireStatus.Closed

			case '提出済':
				return ExpireStatus.Submitted

			default:
				return ExpireStatus.Other
		}
	}

	private static toSubjectType(str: string): SubjectType {
		switch(str) {
			case '小テスト':
				return SubjectType.Exam

			case 'レポート':
				return SubjectType.Report

			case '授業アンケート':
				return SubjectType.SubjectSurvey

			case '学内アンケート':
				return SubjectType.SchoolSurvey

			case '授業評価アンケート':
				return SubjectType.SubjectReview

			default:
				return SubjectType.Other
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
