package com.bmtest.finalgithub.base.repository;

import com.bmtest.finalgithub.base.model.Table1Base;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public class Table1BaseRepositoryImpl<M extends Table1Base> {

  protected Table1BaseRepositoryImpl() {
    /* Protected: meant for extension by entity-specific Table1 repository */
  }
}
