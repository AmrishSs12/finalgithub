package com.bmtest.finalgithub.infrastructure.deploy.service;

import com.bmtest.finalgithub.base.infrastructure.deploy.service.DeploymentBaseService;
import com.rappit.rd.base.deploy.GenericDeployer;
import com.rappit.rd.base.loader.file.SchemaFileLoader;
import org.springframework.stereotype.Service;

@Service
public class DeploymentService extends DeploymentBaseService {
  public DeploymentService(GenericDeployer genericDeployer, SchemaFileLoader schemaFileLoader) {
    super(genericDeployer, schemaFileLoader);
  }
}
