package com.bmtest.finalgithub.base.controller;

import com.bmtest.finalgithub.base.util.SQLUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/rest/rdbms", produces = "application/json")
public class SQLUtilController {
  private final SQLUtil sqlUtil;

  public SQLUtilController(SQLUtil sqlUtil) {
    this.sqlUtil = sqlUtil;
  }

  @PostMapping(path = "/generatesqlscript", produces = "application/json")
  public ResponseEntity<Object> generateSQLScript() throws ClassNotFoundException {
    return sqlUtil.generateSqlScriptResponse();
  }
}
