package com.bmtest.finalgithub.base.service;

import com.bmtest.finalgithub.base.model.ApplicationUserAnalyticalBase;
import com.bmtest.finalgithub.base.model.ApplicationUserBase;
import com.rappit.rd.base.model.IModelTransformer;
import org.springframework.stereotype.Component;

@Component
public class ApplicationUserAnalyticalTransformer<
        M extends ApplicationUserBase, T extends ApplicationUserAnalyticalBase>
    implements IModelTransformer<M, T> {
  @Override
  public T writeTo(M model) {
    ApplicationUserAnalyticalBase applicationUserAnalyticalBase =
        new ApplicationUserAnalyticalBase();

    applicationUserAnalyticalBase.setSid(model.getSid());
    return (T) applicationUserAnalyticalBase;
  }

  @Override
  public Object readFrom(T data) {
    return null;
  }

  @Override
  public Class<M> getSourceClass() {
    return (Class<M>) ApplicationUserBase.class;
  }

  @Override
  public Class<T> getTargetClass() {
    return (Class<T>) ApplicationUserAnalyticalBase.class;
  }
}
