
import { BaseAppConstants } from "./app-constants.base";
export class BaseApiConstants {
    public static isMobile = window.matchMedia('only screen and (max-width: 760px)').matches;
    public static apihost = '/rest';
    public static readonly workFlowConfig: any = {
        url: "/rest/workflowconfig/getconfig/{workflowType}",
        method: "GET",
        showloading: true
    };
    public static readonly getChangelog: any = {
        url: '/rest/changelogs/datatable/{entityName}/{entityId}/{fieldName}/{fromModifiedDate}',
        method: 'POST',
        showloading: true
    };

    public static readonly uploadAttachment: any = {  // It's not using base service, so context path has to be added separtely
        url: BaseAppConstants.contextPath + '/rest/attachments/upload',
        method: 'POST',
        showloading: true
    }

    public static workflowHistory: any = {
        url: '/rest/workflowhistory/{workflowType}/{modelid}/datatable',
        method: 'POST',
        showloading: false
    }

    public static logout: any = {
        url: '/rest/logout',
        method: 'POST',
        showloading: false
    }

    public static getUserRoles: any = {
        url: '/rest/applicationusers/roles',
        method: "GET",
        showloading: false
    }

    public static getRCToken: any ={
        url: '/rest/rc/getrwftoken',
        method: "GET",
        showloading: false
    }

    public static getRCBaseUrl:any ={
        url: '/rest/rc/getbaseurl',
        method: "GET",
        showloading: false
    }

    public static updateLanguage: any = {
        url: '/rest/applicationusers/userlanguage',
        method: 'PUT',
        showloading: true
    }
    
    public static getRWFTableInfo:any ={
        url: '/rest/runtime/gettableinfo/{tableId}',
        method: "GET",
        showloading: true
    }

    public static getFirebaseConfig:any ={
        url: '/rest/google-identity/firebase-config',
        method: "GET",
        showloading: true
    };
}
