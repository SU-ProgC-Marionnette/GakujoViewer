import { Pages } from './pages'

export class Selectors {
    static readonly topPageId           = 'emptyForm'
    static readonly msLoginPageId       = 'i0116'
    static readonly msOtpPageId         = 'idTxtBx_SAOTCC_OTC'
    static readonly suSSOPageClass      = 'button--full'
    static readonly dialogCloseClass    = 'ui-dialog-titlebar-close'

    static readonly msLoginPage         = `#${this.msLoginPageId}`
    static readonly msOtpPage           = `#${this.msOtpPageId}`
    static readonly suSSOPage           = `.${this.suSSOPageClass}[name="_eventId_proceed"]`
    static readonly dialogCloseBtn      = `.${this.dialogCloseClass}`
    static readonly topPage             = `#${this.topPageId}[action="/${Pages.Top}"]`
    static readonly contactPage         = `#BaseForm[action="/${Pages.Contact}"]`
    static readonly subjectPage         = `#BaseForm[action="/${Pages.Subject}"]`

    static readonly loginBtn            = '#btnSsoStart'
    static readonly menuBtn             = '.c-main-menu-btn'
    static readonly logoBtn             = 'a[onclick*="logoClick"]'

    static readonly menuContactLink     = '.c-gnav-link.is-information'
    static readonly menuSubjectLink     = '.c-gnav-link.is-take'
    static readonly menuSubjectListLink = '.c-gnav-children-link[onclick*="SC_14002B00_01"]'

    static readonly dataTable           = '#dataTable01'
    static readonly dataTableNextBtn    = '#dataTable01_next'
    static readonly lineTable           = '.c-contents-body > .c-table-line'

    static readonly statusInfo          = '.c-status-info'
    static readonly statusNotice        = '.c-status-notice'

    static readonly contactTitle        = '.c-fixed-heading-main .c-heading-h3'
    static readonly contactType         = '.c-fixed-heading-submission-row:nth-child(2) .c-form-box'
    static readonly contactCategory     = '.c-fixed-heading-submission-row:nth-child(3) .c-form-box'

    static readonly subjectTitle        = '.c-heading'
    static readonly subjectReviewMethod = '.submission_place dd'
    static readonly subjectExpireDate   = '.side-right .date'
    static readonly subjectDescription  = '.c-contents-body .-small .text'
}
