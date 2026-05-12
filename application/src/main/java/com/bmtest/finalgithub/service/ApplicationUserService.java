package com.bmtest.finalgithub.service;

import com.bmtest.finalgithub.base.service.ApplicationUserBaseService;
import com.bmtest.finalgithub.model.ApplicationUser;
import com.bmtest.finalgithub.repository.ApplicationUserRepository;
import org.springframework.stereotype.Service;

@Service("applicationUserService")
public class ApplicationUserService extends ApplicationUserBaseService<ApplicationUser>
    implements IApplicationUserService<ApplicationUser> {

  public ApplicationUserService(ApplicationUserRepository applicationUserRepository) {
    super(ApplicationUser.class, applicationUserRepository);
  }
}
