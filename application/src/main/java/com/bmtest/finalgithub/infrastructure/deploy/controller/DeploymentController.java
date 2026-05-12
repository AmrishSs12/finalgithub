package com.bmtest.finalgithub.infrastructure.deploy.controller;

import com.bmtest.finalgithub.base.infrastructure.deploy.controller.DeploymentBaseController;
import com.bmtest.finalgithub.infrastructure.deploy.service.DeploymentService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/rest/deploy/", produces = "application/json")
public class DeploymentController extends DeploymentBaseController<DeploymentService> {

  public DeploymentController(DeploymentService deploymentService) {
    super(deploymentService);
  }
}
