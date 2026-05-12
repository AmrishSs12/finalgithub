
export class RwftaskApiConstants {
    public static readonly getDatatableData: any = {
        url: '/rest/runtimewftasklists/datatable',
        method: 'POST',
        showloading: true
    };
    public static readonly performActionTaskList : any = {
        url: '/rest/rwf/{actionEndpoint}/performactionfromtasklist',
        method: 'POST',
        showloading: true
    };
    public static readonly getTablesInfo: any = {
        url: '/rest/runtime/gettablesinfo',
        method: 'GET',
        showloading: true
    };
}