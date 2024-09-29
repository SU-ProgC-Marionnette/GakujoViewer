import { ListData } from "./listdata";
import { ContactType } from "./contacttype";

export class ContactData extends ListData{
    type: ContactType;
    date: Date | null;
    targetDate:Date | null;
    read: boolean;
    important: boolean;

    constructor(id:number, subject:string, title: string,
        type: ContactType, date: Date | null, targetDate: Date | null, read: boolean, important: boolean){
        super(id, subject, title);

        this.type       = type;
        this.date       = date;
        this.targetDate = targetDate;
        this.read       = read;
        this.important  = important;
    }
}
