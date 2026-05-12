import { ImportHistoryBase } from "./import-history.base.model";

export class ImportHistoryApiConstants {
    public static readonly getDatatableData: any = {
        url: '/rest/rappitimports/datatable',
        method: 'POST',
        showloading: true
    };
}