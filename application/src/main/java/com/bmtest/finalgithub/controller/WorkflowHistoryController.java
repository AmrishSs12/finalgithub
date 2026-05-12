package com.bmtest.finalgithub.controller;

import com.rappit.rd.base.controller.WorkflowHistoryBaseController;
import com.rappit.rd.base.workflow.history.IWorkflowHistoryService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/rest/workflowhistory/", produces = "application/json")
public class WorkflowHistoryController extends WorkflowHistoryBaseController {
  public WorkflowHistoryController(IWorkflowHistoryService iWorkflowHistoryService) {
    super(iWorkflowHistoryService);
  }
}
