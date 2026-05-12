package com.bmtest.finalgithub.service;

import com.rappit.rd.base.workflow.history.WorkflowHistoryServiceBaseImpl;
import com.rappit.rd.sql.repository.WorkflowHistoryRepository;
import org.springframework.stereotype.Service;

@Service
public class WorkflowHistoryService extends WorkflowHistoryServiceBaseImpl {
  public WorkflowHistoryService(WorkflowHistoryRepository workflowHistoryRepository) {
    super(workflowHistoryRepository);
  }
}
