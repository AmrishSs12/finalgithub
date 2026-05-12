export interface ProviderMappingBase {
	providerName: string;
	sid: string;
	id: string;
	appUserId: string,
	producer: string;
	consumer: string;
	authenticationMode: string;
	baseURL: string;
	clientId: string;
	clientSecret: string;
	apiKey: string;
	issuerURL:string;
	tokenURL:string;
	username: string;
	password: string;
}