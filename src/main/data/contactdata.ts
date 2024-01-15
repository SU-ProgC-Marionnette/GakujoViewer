import { ListData } from "./listdata";
import { ContactType } from "./contacttype";

export class ContactData extends ListData{
    staff: string;
    type: ContactType;
    date: Date | null;
    targetDate:Date | null;
    read: boolean;
    important: boolean;

    constructor(subject:string, title: string,
        staff: string, type: ContactType, date: Date | null, targetDate: Date | null,read: boolean, important: boolean){
        super(subject, title);
        this.staff=staff;
        this.type= type;
        this.date= date;
        this.targetDate= targetDate;
        this.read= read;
        this.important= important;
    }
}
