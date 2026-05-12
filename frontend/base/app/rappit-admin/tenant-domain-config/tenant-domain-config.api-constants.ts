export class TenantDomainConfigApiConstants {
    public static readonly getById: any = {
        url: '/rest/multitenant/{sid}',
        method: 'GET',
        showloading: true
    };
    public static readonly getAllDatatableData: any = {
        url: '/rest/multitenant/datatable/all',
        method: 'POST',
        showloading: true
    };
    public static readonly update: any = {
        url: '/rest/multitenant/',
        method: 'PUT',
        showloading: true
    };
    public static readonly create: any = {
        url: '/rest/multitenant/',
        method: 'POST',
        showloading: true
    };
    public static readonly activate: any = {
        url: '/rest/multitenant/activate/{ids}',
        method: 'POST',
        showloading: true
    };
    public static readonly deactivate: any = {
        url: '/rest/multitenant/deactivate/{ids}',
        method: 'POST',
        showloading: true
    };
    public static readonly delete: any = {
        url: '/rest/multitenant/{ids}',
        method: 'DELETE',
        showloading: true
    };
    public static readonly getDatatableData: any = {
        url: '/rest/multitenant/datatable',
        method: 'POST',
        showloading: true
    };
    public static readonly getTenants: any = {
        url: '/rest/multitenant/tenants',
        method: 'GET',
        showloading: true
    };
}