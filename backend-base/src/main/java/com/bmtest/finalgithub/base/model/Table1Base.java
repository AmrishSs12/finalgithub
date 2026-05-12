package com.bmtest.finalgithub.base.model;

import com.rappit.rd.base.annotations.Table;
import com.rappit.rd.base.model.BasePersistModel;
import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.Size;

@MappedSuperclass
@Table(
    name = "Table1",
    keys = {"sid"})
public class Table1Base extends BasePersistModel {
  @Column(length = 36)
  @Size(min = 36, max = 36, message = "INVALID_VALUE_RANGE")
  @Id
  private String sid;

  @Override
  public String getSid() {
    return sid;
  }

  @Override
  public void setSid(String sid) {
    this.sid = sid;
  }

  @Override
  public String toString() {
    return "Table1{" + "sid='" + getSid() + "'" + "}";
  }
}
