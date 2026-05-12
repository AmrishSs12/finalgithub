export interface ApplicationUserBase {
	sid: string;
	createdBy: string;
	createdDate: Date;
	modifiedBy: string;
	modifiedDate: Date;
	syncTime: Date;
	languageCode: string;
	email: string;
	firstName: string;
	lastName: string;
	userRoles: string;
	appAdmin: Boolean;
uniqueId:string;
}