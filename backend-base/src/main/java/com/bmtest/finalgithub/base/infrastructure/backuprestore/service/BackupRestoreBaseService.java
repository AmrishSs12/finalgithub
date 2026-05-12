package com.bmtest.finalgithub.base.infrastructure.backuprestore.service;

import com.rappit.rd.base.backuprestore.BaseBackupRestoreService;
import com.rappit.rd.base.backuprestore.GenericBackup;

public class BackupRestoreBaseService extends BaseBackupRestoreService {
  public BackupRestoreBaseService(GenericBackup backup) {
    super(backup);
  }
}
