package com.bmtest.finalgithub.repository;

import com.bmtest.finalgithub.base.repository.ApplicationUserBaseRepository;
import com.bmtest.finalgithub.model.ApplicationUser;
import org.springframework.stereotype.Repository;

@Repository
public interface ApplicationUserRepository
    extends ApplicationUserBaseRepository<ApplicationUser, String> {}
