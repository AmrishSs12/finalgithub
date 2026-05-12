package com.bmtest.finalgithub.base.repository;

import com.bmtest.finalgithub.base.model.ApplicationUserBase;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public class ApplicationUserBaseRepositoryImpl<M extends ApplicationUserBase> {

  protected ApplicationUserBaseRepositoryImpl() {
    /* Protected: meant for extension by entity-specific ApplicationUser repository */
  }
}
