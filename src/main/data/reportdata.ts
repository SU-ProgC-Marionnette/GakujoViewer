import { ExpireData } from "./expiredata";
import { ExpireStatus } from "./expirestatus";
import { SubmitType } from "./submittype";

export class ReportData extends ExpireData{
    submit: Date | null;

    constructor(id:number, subject:string, title:string,
        status: ExpireStatus, start: Date | null, expire:Date | null, type: SubmitType,submit: Date | null){
        super(id, subject, title, status, start, expire, type);
        this.submit= submit;
    }
}
