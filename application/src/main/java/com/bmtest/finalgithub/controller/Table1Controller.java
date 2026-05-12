package com.bmtest.finalgithub.controller;

import com.bmtest.finalgithub.base.controller.Table1BaseController;
import com.bmtest.finalgithub.model.Table1;
import com.bmtest.finalgithub.service.Table1Service;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "rest/table1s/", produces = "application/json")
public class Table1Controller extends Table1BaseController<Table1> {
  public Table1Controller(Table1Service table1Service) {
    super(table1Service);
  }
}
