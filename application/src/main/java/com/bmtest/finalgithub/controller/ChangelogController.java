package com.bmtest.finalgithub.controller;

import com.rappit.rd.base.controller.ChangelogBaseController;
import com.rappit.rd.base.service.changelog.IChangelogService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/rest/changelogs/", produces = "application/json")
public class ChangelogController extends ChangelogBaseController implements IChangelogController {

  public ChangelogController(IChangelogService changelogService) {
    super(changelogService);
  }
}
