package com.bmtest.finalgithub.base.infrastructure.deploy.service;

import com.rappit.rd.base.deploy.BaseDeploymentService;
import com.rappit.rd.base.deploy.GenericDeployer;
import com.rappit.rd.base.loader.file.SchemaFileLoader;

public class DeploymentBaseService extends BaseDeploymentService {
  public DeploymentBaseService(GenericDeployer genericDeployer, SchemaFileLoader schemaFileLoader) {
    super(genericDeployer, schemaFileLoader);
  }
}
