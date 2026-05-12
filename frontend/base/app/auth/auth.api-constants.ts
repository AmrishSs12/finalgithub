import { BaseApiConstants } from "@baseapp/api-constants.base";
export class AuthApiConstants {

    public static readonly authenticate: any = {
        url: BaseApiConstants.apihost + '/applicationusers/authenticate',
        method: 'GET',
        showloading: true
    };
    public static readonly login: any = {
        url: '/login',
        method: 'GET',
        showloading: true
    };
    public static readonly getUserData: any = {
        url: BaseApiConstants.apihost + '/applicationusers/user-details',
        method: 'GET',
        showloading: true
    };
    public static readonly authenticateGci: any = {
        url: BaseApiConstants.apihost + '/google-identity/authenticate',
        method: 'GET',
        showloading: true
    };
    public static readonly updateUserDetails: any = {
        url: BaseApiConstants.apihost + '/applicationusers/name',
        method: 'PUT',
        showloading: true
    };
    public static readonly sendEmailVerification: any = {
        url: BaseApiConstants.apihost + '/google-identity/otp/provision',
        method: 'POST',
        showloading: true
    };
    public static readonly fetchTenantInfo: any = {
        url: BaseApiConstants.apihost + '/multitenant/tenant-retrieve',
        method: 'POST',
        showloading: true
    };
}