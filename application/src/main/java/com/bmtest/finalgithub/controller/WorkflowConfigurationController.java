package com.bmtest.finalgithub.controller;

import com.rappit.rd.base.controller.WorkflowConfigurationBaseController;
import com.rappit.rd.base.workflow.config.WorkflowConfigurationInfoService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/rest/workflowconfig/", produces = "application/json")
public class WorkflowConfigurationController extends WorkflowConfigurationBaseController {

  public WorkflowConfigurationController(
      WorkflowConfigurationInfoService workflowConfigurationInfoService) {
    super(workflowConfigurationInfoService);
  }
}
