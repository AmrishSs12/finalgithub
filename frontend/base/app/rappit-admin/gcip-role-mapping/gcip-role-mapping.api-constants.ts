export class GcipRoleMappingApiConstants {
    public static readonly getById: any = {
        url: '/rest/rappitgciprolemapping/{sid}',
        method: 'GET',
        showloading: true
    };
    public static readonly getAllDatatableData: any = {
        url: '/rest/rappitgciprolemapping/datatable/all',
        method: 'POST',
        showloading: true
    };
    public static readonly update: any = {
        url: '/rest/rappitgciprolemapping/',
        method: 'PUT',
        showloading: true
    };
    public static readonly create: any = {
        url: '/rest/rappitgciprolemapping/',
        method: 'POST',
        showloading: true
    };
    public static readonly activate: any = {
        url: '/rest/rappitgciprolemapping/activate/{ids}',
        method: 'POST',
        showloading: true
    };
    public static readonly deactivate: any = {
        url: '/rest/rappitgciprolemapping/deactivate/{ids}',
        method: 'POST',
        showloading: true
    };
    public static readonly delete: any = {
        url: '/rest/rappitgciprolemapping/{ids}',
        method: 'DELETE',
        showloading: true
    };
    public static readonly getDatatableData: any = {
        url: '/rest/rappitgciprolemapping/datatable',
        method: 'POST',
        showloading: true
    };
    public static readonly setup: any = {
        url: '/rest/rappitgciprolemapping/setup',
        method: 'POST',
        showloading: true
    };
}