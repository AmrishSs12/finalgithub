

export class ClientMappingApiConstants {
    public static readonly getDatatableData: any = {
        url: '/rest/restexposedapis/datatable',
        method: 'POST',
        showloading: true
    };
    public static readonly setup: any = {
        url: '/rest/restexposedapis/setup',
        method: 'POST',
        showloading: true
    };
    public static readonly generate: any = {
        url: '/rest/restexposedapis/saveclientdata',
        method: 'POST',
        showloading: true
    };
    public static readonly getById: any = {
        url: '/rest/restexposedapis/{sid}',
        method: 'GET',
        showloading: true
    };
    public static readonly update: any = {
        url: '/rest/restexposedapis/',
        method: 'PUT',
        showloading: true
    };
}