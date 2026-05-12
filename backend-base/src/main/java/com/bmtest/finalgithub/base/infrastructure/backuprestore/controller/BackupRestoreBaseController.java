package com.bmtest.finalgithub.base.infrastructure.backuprestore.controller;

import com.bmtest.finalgithub.base.infrastructure.backuprestore.service.BackupRestoreBaseService;
import com.rappit.rd.base.backuprestore.model.BackupRestoreInfo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

public class BackupRestoreBaseController<M extends BackupRestoreBaseService> {

  private M service;

  public BackupRestoreBaseController(M service) {
    this.service = service;
  }

  @PostMapping("/backup/table")
  public ResponseEntity<M> backupTable(
      @RequestParam("action") String action, @RequestBody BackupRestoreInfo info) {
    if (info.getTables() != null && info.getTables().size() == 1) {
      service.backUpTable(
          action,
          info.getRepoName(),
          info.getSnapshot(),
          info.getTables().get(0),
          info.getBasePath());
    } else if (info.getTables() != null && info.getTables().size() > 1) {
      service.backUpTables(
          action, info.getRepoName(), info.getSnapshot(), info.getTables(), info.getBasePath());
    } else {
      return ResponseEntity.badRequest().build();
    }
    return ResponseEntity.ok().build();
  }

  @PostMapping("/backup/schedule")
  public ResponseEntity<M> backupSchedule(
      @RequestParam("action") String action, @RequestBody BackupRestoreInfo info) {
    service.createBackUpSchedule(
        action,
        info.getSnapshot(),
        info.getRepoName(),
        info.getTables(),
        info.getScheduleConfig(),
        info.getBasePath());
    return ResponseEntity.ok().build();
  }

  @PostMapping("/restore/table")
  public ResponseEntity<M> restoreTable(
      @RequestParam("action") String action, @RequestBody BackupRestoreInfo info) {
    if (info.getTables() != null && info.getTables().size() == 1) {
      service.restoreBackupTable(
          action, info.getRepoName(), info.getSnapshot(), info.getTables().get(0));
    } else if (info.getTables() != null && info.getTables().size() > 1) {
      service.restoreBackupTables(action, info.getRepoName(), info.getSnapshot(), info.getTables());
    } else {
      return ResponseEntity.badRequest().build();
    }
    return ResponseEntity.ok().build();
  }
}
