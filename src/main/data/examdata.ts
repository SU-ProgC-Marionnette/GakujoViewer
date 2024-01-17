import { ExpireData } from "./expiredata";
import { ExpireStatus } from "./expirestatus";
import { SubmitType } from "./submittype";
import { SubmitStatus } from "./submitstatus";

export class ExamData extends ExpireData{
    submit: SubmitStatus;

    constructor(id:number, subject:string, title:string,
        status: ExpireStatus, start: Date | null, expire:Date | null, type: SubmitType,submit: SubmitStatus){
        super(id, subject, title, status, start, expire, type);
        this.submit= submit;
    }
}
