import { ListData } from "./listdata";
import { ContactType } from "./contacttype";

export class ContactData extends ListData{
    staff: string | null = null;
    type: ContactType | null = null;
    date: Date | null = null;
    targetDate:Date | null = null;
    read: boolean | null = null;
    important: boolean | null = null;
}