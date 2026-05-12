import { ExportHistoryBase } from "./export-history.base.model";

export class ExportHistoryApiConstants {
    public static readonly getDatatableData: any = {
        url: '/rest/rappitexports/datatable',
        method: 'POST',
        showloading: true
    };
}