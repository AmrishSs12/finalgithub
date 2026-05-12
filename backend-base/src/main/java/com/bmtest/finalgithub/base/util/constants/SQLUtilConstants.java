package com.bmtest.finalgithub.base.util.constants;

import java.util.Arrays;
import java.util.List;

public class SQLUtilConstants {

  private SQLUtilConstants() {
    /* Non-instantiable: contains only static SQL entity class constants */
  }

  public static final List<String> ENTITY_CLASSES =
      Arrays.asList(
          "com.rappit.rd.base.tasks.model.TaskProgress",
          "com.rappit.rd.base.model.Changelog",
          "com.bmtest.finalgithub.model.ApplicationUser",
          "com.rappit.rd.base.tasks.Task",
          "com.rappit.rd.base.attachment.model.EvaAttachment",
          "com.rappit.rd.security.jwt.model.AuthRevokedToken",
          "com.rappit.rd.base.model.Outbox");
}
