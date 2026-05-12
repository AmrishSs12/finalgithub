import { ApplicationUserBase} from '@baseapp/application-user/application-user/application-user.base.model';

export class ApplicationUserApiConstants {
    public static readonly delete: any = {
        url: '/rest/applicationusers/{ids}',
        method: 'DELETE',
        showloading: true
    };
    public static readonly getById: any = {
        url: '/rest/applicationusers/{sid}',
        method: 'GET',
        showloading: true
    };
    public static readonly getBysiduniqueIndex: any = {
        url: '/rest/applicationusers/getbysidunique/{sid}',
        method: 'GET',
        showloading: true
    };
    public static readonly getByemailprimaryIndex: any = {
        url: '/rest/applicationusers/getbyemailprimary/{email}',
        method: 'GET',
        showloading: true
    };
    public static readonly create: any = {
        url: '/rest/applicationusers/',
        method: 'POST',
        showloading: true
    };
    public static readonly update: any = {
        url: '/rest/applicationusers/',
        method: 'PUT',
        showloading: true
    };
    public static readonly getDatatableData: any = {
        url: '/rest/applicationusers/datatable',
        method: 'POST',
        showloading: true
    };
}