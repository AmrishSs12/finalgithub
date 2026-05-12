package com.bmtest.finalgithub.base.repository;

import com.bmtest.finalgithub.base.model.ApplicationUserBase;
import com.rappit.rd.base.repository.IBaseJpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface ApplicationUserBaseRepository<M extends ApplicationUserBase, ID>
    extends IBaseJpaRepository<M, ID> {}
