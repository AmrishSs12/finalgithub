export interface ClientMappingBase {
	mail: string;
	userContextRequired: boolean;
	clientName: string;
	clientId: string;
	id: string;
	sid: string;
	authenticationMode: string;
	role: string;
	clientSecret: string;
	generatedBy: string;
	generatedOn: Date;
	accessTokenExpiry: number;
	saEmail:string;
	kmsKeyRingId?: string;
	kmsKeyId?: string;
	kmsKeyLocationId?: string;
	kmsProjectId?: string;
}