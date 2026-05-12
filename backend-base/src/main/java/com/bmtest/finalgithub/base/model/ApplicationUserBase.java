package com.bmtest.finalgithub.base.model;

import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.annotation.Nulls;
import com.rappit.rd.base.annotations.Table;
import com.rappit.rd.base.annotations.UniqueConstraint;
import com.rappit.rd.base.authentication.model.UserPrivilege;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;

@MappedSuperclass
@Table(
    name = "ApplicationUser",
    keys = {"sid"},
    uniqueConstraints = {
      @UniqueConstraint(
          name = "SIDUnique",
          columnNames = {"sid"})
    })
public class ApplicationUserBase extends UserPrivilege {
  private String sid;

  @JsonSetter(nulls = Nulls.AS_EMPTY)
  private Boolean appAdmin = false;

  @Override
  public String getSid() {
    return sid;
  }

  @Override
  public void setSid(String sid) {
    this.sid = sid;
  }

  public Boolean isAppAdmin() {
    return appAdmin;
  }

  public void setAppAdmin(Boolean appAdmin) {
    this.appAdmin = appAdmin;
  }

  @Override
  public String toString() {
    return "ApplicationUser{" + "email='" + getEmail() + "'" + "}";
  }

  @PrePersist
  @PreUpdate
  private void setDefaults() {
    appAdmin = Boolean.TRUE.equals(appAdmin);
  }
}
