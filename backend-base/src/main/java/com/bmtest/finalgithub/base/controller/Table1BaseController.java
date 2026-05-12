package com.bmtest.finalgithub.base.controller;

import com.bmtest.finalgithub.base.model.Table1Base;
import com.bmtest.finalgithub.base.service.ITable1BaseService;
import com.rappit.rd.base.controller.BaseController;
import com.rappit.rd.base.logger.Logger;
import com.rappit.rd.base.logger.LoggerFactory;
import com.rappit.rd.base.util.ErrorCode;
import java.util.Objects;

/**
 * Base controller for {@link Table1Base} entity. Provides REST API endpoints for CRUD operations
 * and other common functionalities.
 *
 * @param <M> the model type extending Table1Base
 */
public abstract class Table1BaseController<M extends Table1Base> extends BaseController<M, M> {

  private static final Logger logger = LoggerFactory.getLogger(Table1BaseController.class);
  protected ITable1BaseService<M> service;

  /**
   * Constructs a new Table1BaseController with the specified service.
   *
   * @param service the service for Table1 operations
   * @throws NullPointerException if service is null
   */
  protected Table1BaseController(ITable1BaseService<M> service) {
    super(Objects.requireNonNull(service, ErrorCode.SERVICE_MUST_NOT_BE_NULL));
    this.service = service;
  }
}
