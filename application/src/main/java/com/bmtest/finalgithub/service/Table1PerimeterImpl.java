package com.bmtest.finalgithub.service;

import com.bmtest.finalgithub.base.model.ApplicationUserBase;
import com.bmtest.finalgithub.base.service.Table1PerimeterBaseImpl;
import com.bmtest.finalgithub.model.Table1;
import com.rappit.rd.base.authentication.logic.AppUserPrivilegeCache;
import org.springframework.stereotype.Service;

@Service
public class Table1PerimeterImpl extends Table1PerimeterBaseImpl<Table1> {
  public Table1PerimeterImpl(AppUserPrivilegeCache<ApplicationUserBase> userCache) {
    super(userCache);
  }
}
