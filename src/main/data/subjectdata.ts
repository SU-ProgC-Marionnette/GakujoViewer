import { ListData } from "./listdata";
import { ExpireStatus } from "./expirestatus";
import { SubmitStatus } from "./submitstatus";
import { SubjectType } from "./subjecttype";

export class SubjectData extends ListData{
    status: ExpireStatus;
    start: Date | null;
    expire: Date | null;
    submit: SubmitStatus;
    type: SubjectType;

    constructor(id: number, subject:string, title:string,
        status: ExpireStatus, start: Date | null, expire: Date | null, submit: SubmitStatus, type: SubjectType){
        super(id,subject,title);
        this.status = status;
        this.start  = start;
        this.expire = expire;
        this.submit = submit;
        this.type   = type;
    }
}
