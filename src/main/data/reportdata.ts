import { ExpireData } from "./expiredata";
import { ExpireStatus } from "./expirestatus";
import { SubmitType } from "./submittype";

export class ReportData extends ExpireData{
    submit: Date;

    constructor(subject:string, title:string,
        status: ExpireStatus, start: Date, expire:Date, type: SubmitType,submit: Date){
        super(subject, title, status, start, expire, type);
        this.submit= submit;
    }
}