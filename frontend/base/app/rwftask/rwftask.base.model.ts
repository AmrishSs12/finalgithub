export interface RwftaskBase {
	sid: string;
	createdBy: string;
	createdDate: Date;
	modifiedBy: string;
	modifiedDate: Date;
	name: string;
	description: string;
	recordStatus: string;
	status: string;
	dueDate: Date;
	action: string;
    actionTaken: string;
    actionTakenBy: string;
    resourceStatusCode: string;
    uniqueId:string;
}