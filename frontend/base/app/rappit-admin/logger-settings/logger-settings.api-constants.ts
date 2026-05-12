export class LoggerSettingsConstants {

    public static readonly getPackages: any = {
        url: '/rest/logger/get-packages',
        method: 'GET',
        showloading: true
    };
    public static readonly saveLogger: any = {
        url: '/rest/logger/set-level/{packageName}/{logLevel}',
        method: 'POST',
        showloading: true
    };
}