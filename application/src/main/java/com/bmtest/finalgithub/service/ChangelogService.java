package com.bmtest.finalgithub.service;

import com.rappit.rd.base.service.changelog.ChangelogBaseService;
import com.rappit.rd.sql.repository.ChangelogRepository;
import org.springframework.stereotype.Service;

@Service
public class ChangelogService extends ChangelogBaseService {

  public ChangelogService(ChangelogRepository changelogRepository) {
    super(changelogRepository);
  }
}
