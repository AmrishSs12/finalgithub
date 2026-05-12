package com.bmtest.finalgithub.base.repository;

import com.bmtest.finalgithub.base.model.Table1Base;
import com.rappit.rd.base.repository.IBaseJpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface Table1BaseRepository<M extends Table1Base, ID> extends IBaseJpaRepository<M, ID> {}
