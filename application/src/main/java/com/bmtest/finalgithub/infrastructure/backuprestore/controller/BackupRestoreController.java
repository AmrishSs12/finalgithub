package com.bmtest.finalgithub.infrastructure.backuprestore.controller;

import com.bmtest.finalgithub.base.infrastructure.backuprestore.controller.BackupRestoreBaseController;
import com.bmtest.finalgithub.infrastructure.backuprestore.service.BackupRestoreService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/rest/snapshot/", produces = "application/json")
public class BackupRestoreController extends BackupRestoreBaseController<BackupRestoreService> {

  public BackupRestoreController(BackupRestoreService backupRestoreService) {
    super(backupRestoreService);
  }
}
