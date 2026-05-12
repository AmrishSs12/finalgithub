package com.bmtest.finalgithub.service;

import com.bmtest.finalgithub.base.service.ApplicationUserPerimeterBaseImpl;
import com.bmtest.finalgithub.model.ApplicationUser;
import com.rappit.rd.base.authentication.logic.AppUserPrivilegeCache;
import com.rappit.rd.base.listener.BaseApplicationConfiguration;
import com.rappit.rd.security.authentication.WhitelistedAdminUserProvisioningService;
import org.springframework.stereotype.Component;

@Component
public class ApplicationUserPerimeterImpl
    extends ApplicationUserPerimeterBaseImpl<ApplicationUser> {
  ApplicationUserPerimeterImpl(
      AppUserPrivilegeCache<ApplicationUser> userCache,
      WhitelistedAdminUserProvisioningService provisioningService,
      BaseApplicationConfiguration baseApplicationConfiguration) {
    super(userCache, provisioningService, baseApplicationConfiguration);
  }
}
