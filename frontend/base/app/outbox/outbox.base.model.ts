export interface OutboxBase {
	outboxId: number;
	entityType: string;
	entityId: string;
	eventType: string;
	payload: string;
	target: string;
	status: string;
	errorMessage: string;
	processorId: string;
	processedDate: Date;
	sid: string;
	taskId: string;
	retryCount: number;
	createdDate: Date;
	createdBy: string;
	modifiedDate: Date;
	modifiedBy: string;
}
