export class BaseAppConstants {
	public static mobileMaxWidth = 1024;
	public static isMobile = window.matchMedia('only screen and (max-width: ' + BaseAppConstants.mobileMaxWidth + 'px)').matches;
	
	public static calDateFormat = 'dd-mm-y';
	public static defaultLocale = getLocale();
	public static defaultCurrency = 'EUR';
	public static defaultPageSize = 50;
	public static attachmentBaseURL = 'rest/attachments/download/attachment/';
	public static importTemplateURL = 'rest/attachments/download/template/';
	public static importErrorsDownloadURL = 'rest/rappitimporterrors/download/';
	public static enableReadOnly = false;
	public static localFilePath = '/assets/images/';
	public static showScrollSpy = false;
	public static showBreadcrumb = false;
	public static selectFirstMenuByDefault = false;
	public static showPaginationonTop = true;
	public static showPaginationonBottom = false;
	public static currency  = 'EUR';
	public static currencyDisplay = 'symbol';
	public static minFraction = 2;
	public static maxFraction = 2;
	public static isSql = true;
	public static withFilterHeightReduction = 280;
  	public static withoutFilterHeightReduction = 230;

	public static dateFormatAngular = 'd MMM y';
	public static dateTimeFormatAngular = 'd MMM y h:mm:ss a';
	public static dateFormatPrimeNG = 'd M yy';
	public static dateTimeFormatPrimeNG = 'd M yy h:mm:ss a';
	public static timeFormatPrimeNG = 'h:mm:ss a';
	public static tableView = 'default';
	public static contextPath = '';
	public static emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
	public static emailRegexForAuthentication = /^(?![.!#$%&'*+/=?^_`{|}~-])(?!.*[!#$%&'*+/=?^_`{|}~.-]{2,})[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
	public static urlRegex = /^https?:\/\/[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)+(\:\d+)?(\/[^\s]*[^\s\/])?$/;
	public static threshold = 10;
	public static isRouterEnabled = false;
	public static amDesignator = 'AM';
	public static pmDesignator = 'PM';
	public static softDeleteFilterDefaultValue = 'ACTIVE_RECORDS_ONLY';
	public static importInfiniteScroll = 'false';
	public static deactivateRecords = false;
	public static displayFilterIn = 'null';
}

function getLocale(): string {
	const browserLang: string = window?.navigator?.language
	// (en|de|fr|ru|tr|it|pl|uk|nl|ja|ko|zh) // English,German,French,Russian,Turkish,Italian,Polish,Ukrainian,Dutch,Japanese,Korean,Chinese
	const supportingLanguages: string[] = ['en-US', 'de-DE', 'fr-FR', 'ru-RU', 'tr-TR', 'it-IT', 'pl-PL', 'uk-UA', 'nl-NL', 'ja-JP', 'ko-KR', 'zh-CN']
	if (browserLang) {
		if (containsPartialMatch(browserLang, supportingLanguages)) {
			return browserLang;
		} else {
			return 'en-US'
		}
	} else {
		return 'en-US'
	}
}

function containsPartialMatch(browserLang: any, supportingLanguages: any) {
	return supportingLanguages.some((langs: string | any[]) => langs.includes(browserLang));
}
