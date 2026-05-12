package com.bmtest.finalgithub.service;

import com.rappit.rd.base.autonumber.logic.AutoNumberServiceBase;
import com.rappit.rd.base.cache.AutoNumberCache;
import com.rappit.rd.base.cache.LockCache;
import com.rappit.rd.sql.repository.AutoNumberRepository;
import org.springframework.stereotype.Service;

@Service
public class AutoNumberService extends AutoNumberServiceBase {
  public AutoNumberService(
      AutoNumberCache autoNumberCache,
      LockCache lockCache,
      AutoNumberRepository autoNumberRepository) {
    super(autoNumberCache, lockCache, autoNumberRepository);
  }
}
