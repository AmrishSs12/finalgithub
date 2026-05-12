package com.bmtest.finalgithub.base.infrastructure.deploy.controller;

import com.bmtest.finalgithub.base.infrastructure.deploy.service.DeploymentBaseService;
import com.rappit.rd.base.annotations.Traced;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

public class DeploymentBaseController<M extends DeploymentBaseService> {

  private M bl;

  public DeploymentBaseController(M bl) {
    this.bl = bl;
  }

  @PostMapping("/setup")
  @Traced
  public ResponseEntity<M> setup(@RequestParam("action") String action) {
    bl.setup("1.0", action);
    return ResponseEntity.ok().build();
  }
}
