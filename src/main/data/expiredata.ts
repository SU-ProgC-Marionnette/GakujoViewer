import { ListData } from "./listdata";
import { ExpireStatus } from "./expirestatus";
import { SubmitType } from "./submittype";

export class ExpireData extends ListData{
    status: ExpireStatus | null = null;
    start: Date | null = null;
    expire: Date | null = null;
    type: SubmitType | null = null;
}
