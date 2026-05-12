import { Table1Base} from '@baseapp/table1/table1/table1.base.model';

export class Table1ApiConstants {
    public static readonly update: any = {
        url: '/rest/table1s/',
        method: 'PUT',
        showloading: true
    };
    public static readonly create: any = {
        url: '/rest/table1s/',
        method: 'POST',
        showloading: true
    };
    public static readonly delete: any = {
        url: '/rest/table1s/{ids}',
        method: 'DELETE',
        showloading: true
    };
    public static readonly getDatatableData: any = {
        url: '/rest/table1s/datatable',
        method: 'POST',
        showloading: true
    };
    public static readonly getById: any = {
        url: '/rest/table1s/{sid}',
        method: 'GET',
        showloading: true
    };
}