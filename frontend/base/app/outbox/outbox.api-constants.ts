export class OutboxApiConstants {
    public static readonly getDatatableData: any = {
        url: '/rest/outbox/datatable',
        method: 'POST',
        showloading: true
    };

    public static readonly getDashboard: any = {
        url: '/rest/outbox/dashboard',
        method: 'GET',
        showloading: false,
        showErrorMsg: false
    };

    public static readonly getEntityTypes: any = {
        url: '/rest/outbox/entity-types',
        method: 'GET',
        showloading: false
    };

    public static readonly bulkRetry: any = {
        url: '/rest/outbox/bulk-retry',
        method: 'POST',
        showloading: true
    };

    public static readonly bulkDelete: any = {
        url: '/rest/outbox/bulk-delete',
        method: 'POST',
        showloading: true
    };

    public static readonly triggerRetryAll: any = {
        url: '/rest/outbox/trigger-retry',
        method: 'POST',
        showloading: true
    };

    public static readonly getRetryStatus: any = {
        url: '/rest/outbox/retry-status/{taskSid}',
        method: 'GET',
        showloading: false
    };
}
