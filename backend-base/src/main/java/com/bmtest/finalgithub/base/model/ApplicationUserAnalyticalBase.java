package com.bmtest.finalgithub.base.model;

import com.rappit.rd.base.annotations.Table;
import com.rappit.rd.base.model.BaseAnalyticalModel;

@Table(name = "ApplicationUser")
public class ApplicationUserAnalyticalBase extends BaseAnalyticalModel {
  private static final long serialVersionUID = -1653584662510644834L;
  private String sid;

  @Override
  public String getSid() {
    return sid;
  }

  @Override
  public void setSid(String sid) {
    this.sid = sid;
  }
}
