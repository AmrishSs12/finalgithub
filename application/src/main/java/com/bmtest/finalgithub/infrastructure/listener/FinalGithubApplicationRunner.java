package com.bmtest.finalgithub.infrastructure.listener;

import com.bmtest.finalgithub.base.infrastructure.config.StartupEventListener;
import com.rappit.rd.base.authentication.logic.AppUserPrivilegeCache;
import com.rappit.rd.base.cache.CacheManager;
import com.rappit.rd.gcp.logging.LoggingRequest;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

@Component
public class FinalGithubApplicationRunner extends StartupEventListener {

  public FinalGithubApplicationRunner(
      @Qualifier("applicationCacheManager") CacheManager cacheManager,
      AppUserPrivilegeCache<?> appUserPrivilegeCache,
      LoggingRequest loggingRequest) {
    super(cacheManager, appUserPrivilegeCache, loggingRequest);
  }
}
