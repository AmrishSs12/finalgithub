export interface ExportHistoryBase {
	sid: string;
	createdDate: Date;
	modifiedBy: string;
	modifiedDate: Date;
	createdBy: string;
	exportType: string;
	filters: string;
	outputNumberFormat: string;
	outputDateTimeFormat: string;
	outputDateFormat: string;
	exportedFile: any;
	completedTime: Date;
	status: string;
	initiatedBy: string;
	initiatedTime: Date;
	uniqueId: string;
}