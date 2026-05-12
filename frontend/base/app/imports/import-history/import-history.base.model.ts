export interface ImportHistoryBase {
	attachmentId: string;
	createdDate: Date;
	templateName: string;
	modelName: string;
	createdBy: string;
	modifiedDate: Date;
	fileType: string;
	modifiedBy: string;
	batchSize: number;
	failedRecords: number;
	succeedRecords: number;
	sid: string;
	importStatus: string;
	completedTime: Date;
	dateFormat: string;
	dateTimeFormat: string;
	numberFormat: string;
	uniqueId: string;
}