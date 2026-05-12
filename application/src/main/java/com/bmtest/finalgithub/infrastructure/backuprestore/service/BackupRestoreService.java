package com.bmtest.finalgithub.infrastructure.backuprestore.service;

import com.bmtest.finalgithub.base.infrastructure.backuprestore.service.BackupRestoreBaseService;
import com.rappit.rd.base.backuprestore.GenericBackup;
import org.springframework.stereotype.Service;

@Service
public class BackupRestoreService extends BackupRestoreBaseService {

  public BackupRestoreService(GenericBackup backup) {
    super(backup);
  }
}
