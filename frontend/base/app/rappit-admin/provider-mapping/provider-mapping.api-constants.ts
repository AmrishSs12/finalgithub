

export class ProviderMappingApiConstants {
    public static readonly getDatatableData: any = {
        url: '/rest/restconsumedapis/datatable',
        method: 'POST',
        showloading: true
    };
    public static readonly setup: any = {
        url: '/rest/restconsumedapis/setup',
        method: 'POST',
        showloading: true
    };
    public static readonly getById: any = {
        url: '/rest/restconsumedapis/{sid}',
        method: 'GET',
        showloading: true
    };
    public static readonly update: any = {
        url: '/rest/restconsumedapis/',
        method: 'PUT',
        showloading: true
    };
}