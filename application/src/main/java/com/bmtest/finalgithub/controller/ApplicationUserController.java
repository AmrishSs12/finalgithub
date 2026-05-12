package com.bmtest.finalgithub.controller;

import com.bmtest.finalgithub.base.controller.ApplicationUserBaseController;
import com.bmtest.finalgithub.model.ApplicationUser;
import com.bmtest.finalgithub.service.ApplicationUserService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/rest/applicationusers/", produces = "application/json")
public class ApplicationUserController extends ApplicationUserBaseController<ApplicationUser> {

  public ApplicationUserController(ApplicationUserService applicationUserService) {
    super(applicationUserService);
  }
}
