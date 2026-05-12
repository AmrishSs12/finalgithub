import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseService } from '@baseapp/base.service';
import { OutboxBase } from './outbox.base.model';
import { OutboxApiConstants } from './outbox.api-constants';


@Injectable({
  providedIn: 'root'
})
export class OutboxService {

  public baseService = inject(BaseService);

  /**
   * Get prototype/mock data for development
   */
  getProtoTypingData(): Observable<any> {
    const subject: Observable<OutboxBase> = new Observable(observer => {
      const mockData: OutboxBase[] = [
        {
          outboxId: 1,
          entityType: 'User',
          entityId: '12345',
          eventType: 'INSERT',
          payload: '{}',
          target: 'SEARCH',
          status: 'PENDING',
          errorMessage: '',
          processorId: '',
          processedDate: new Date(),
          sid: 'abc123',
          taskId: '',
          retryCount: 0,
          createdDate: new Date(),
          createdBy: 'system',
          modifiedDate: new Date(),
          modifiedBy: 'system'
        }
      ];
      observer.next(mockData as any);
    });
    return subject;
  }

  /**
   * Get datatable data with pagination and filtering
   * @param params - The datatable request parameters including pagination, sorting, and filters
   */
  getDatatableData(params: any): Observable<any> {
    const serviceOpts = OutboxApiConstants.getDatatableData;

    const subject = new Observable(observer => {
      this.baseService.post(serviceOpts, params).subscribe((response: any) => {
        observer.next(response);
      },
        (err: any) => {
          observer.error(err);
        });
    });

    return subject;
  }

  /**
   * Get dashboard summary
   */
  getDashboard(): Observable<any> {
    const serviceOpts = OutboxApiConstants.getDashboard;

    return new Observable(observer => {
      this.baseService.get(serviceOpts).subscribe((response: any) => {
        observer.next(response);
      },
        (err: any) => {
          observer.error(err);
        });
    });
  }

  /**
   * Get distinct entity types for filter dropdowns
   */
  getEntityTypes(): Observable<any> {
    const serviceOpts = OutboxApiConstants.getEntityTypes;

    return new Observable(observer => {
      this.baseService.get(serviceOpts).subscribe((response: any) => {
        observer.next(response);
      },
        (err: any) => {
          observer.error(err);
        });
    });
  }

  /**
   * Bulk retry failed outbox entries
   * @param outboxIds - Array of outbox entry IDs to retry
   */
  bulkRetry(outboxIds: number[]): Observable<any> {
    const serviceOpts = { ...OutboxApiConstants.bulkRetry, handleError: false };
    // Ensure we only pass primitive number IDs
    const ids = outboxIds.map(id => Number(id)).filter(id => !isNaN(id));
    if (ids.length !== outboxIds.length) {
      console.warn(`OutboxService.bulkRetry: ${outboxIds.length - ids.length} invalid ID(s) were filtered out`);
    }
    return this.baseService.post(serviceOpts, { outboxIds: ids });
  }

  /**
   * Bulk delete outbox entries
   * @param outboxIds - Array of outbox entry IDs to delete
   */
  bulkDelete(outboxIds: number[]): Observable<any> {
    const serviceOpts = { ...OutboxApiConstants.bulkDelete, handleError: false };
    // Ensure we only pass primitive number IDs
    const ids = outboxIds.map(id => Number(id)).filter(id => !isNaN(id));
    if (ids.length !== outboxIds.length) {
      console.warn(`OutboxService.bulkDelete: ${outboxIds.length - ids.length} invalid ID(s) were filtered out`);
    }
    return this.baseService.post(serviceOpts, { outboxIds: ids });
  }

  /**
   * Trigger retry for all failed outbox entries
   * Creates a background task to process all failed entries
   * @returns Observable with task information including taskSid for status tracking
   */
  triggerRetryAll(): Observable<any> {
    const serviceOpts = { ...OutboxApiConstants.triggerRetryAll, handleError: false };
    return this.baseService.post(serviceOpts, {});
  }

  /**
   * Get retry task status
   * @param taskSid - The task SID to check status for
   */
  getRetryStatus(taskSid: string): Observable<any> {
    const serviceOpts = {
      ...OutboxApiConstants.getRetryStatus,
      url: OutboxApiConstants.getRetryStatus.url.replace('{taskSid}', taskSid),
      handleError: false
    };
    return this.baseService.get(serviceOpts);
  }
}
