package com.bmtest.finalgithub.service;

import com.bmtest.finalgithub.base.service.Table1BaseService;
import com.bmtest.finalgithub.model.Table1;
import com.bmtest.finalgithub.repository.Table1Repository;
import org.springframework.stereotype.Service;

@Service("table1Service")
public class Table1Service extends Table1BaseService<Table1> implements ITable1Service<Table1> {

  public Table1Service(Table1Repository table1Repository) {
    super(Table1.class, table1Repository);
  }
}
