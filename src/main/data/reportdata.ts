import { ExpireData } from "./expiredata";
import { ExpireStatus } from "./expirestatus";
import { SubmitType } from "./submittype";

export class ReportData extends ExpireData{
    submit: Date | null;

    constructor(subject:string, title:string,
        status: ExpireStatus, start: Date | null, expire:Date | null, type: SubmitType,submit: Date | null){
        super(subject, title, status, start, expire, type);
        this.submit= submit;
    }
}
