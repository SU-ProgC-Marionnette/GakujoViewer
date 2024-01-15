import { ListData } from "./listdata";
import { ExpireStatus } from "./expirestatus";
import { SubmitType } from "./submittype";

export class ExpireData extends ListData{
    status: ExpireStatus;
    start: Date | null;
    expire: Date | null;
    type: SubmitType;

    constructor(subject:string, title:string,
        status: ExpireStatus, start: Date | null, expire:Date | null, type: SubmitType){
        super(subject,title);
        this.status= status;
        this.start= start;
        this.expire= expire;
        this.type= type;
    }
}
