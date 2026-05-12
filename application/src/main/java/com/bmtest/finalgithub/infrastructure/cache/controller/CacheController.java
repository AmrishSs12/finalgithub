package com.bmtest.finalgithub.infrastructure.cache.controller;

import com.rappit.rd.base.cache.AppCacheResolver;
import com.rappit.rd.base.controller.CacheBaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/rest/cache/", produces = "application/json")
public class CacheController extends CacheBaseController {

  public CacheController(AppCacheResolver cacheResolver) {
    super(cacheResolver);
  }
}
