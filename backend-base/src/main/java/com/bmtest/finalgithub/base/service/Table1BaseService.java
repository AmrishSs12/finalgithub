package com.bmtest.finalgithub.base.service;

import com.bmtest.finalgithub.base.model.Table1Base;
import com.bmtest.finalgithub.base.repository.Table1BaseRepository;
import com.rappit.rd.base.acl.IPerimeterManager;
import com.rappit.rd.base.logger.Logger;
import com.rappit.rd.base.logger.LoggerFactory;
import com.rappit.rd.base.logic.BaseService;
import com.rappit.rd.base.repository.providers.DBOptions;
import com.rappit.rd.base.repository.providers.DeleteOptions;
import com.rappit.rd.base.repository.providers.PersistenceType;
import com.rappit.rd.base.service.changelog.IChangelogService;
import com.rappit.rd.base.util.ErrorCode;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Base service class for Table1 entity. Provides business logic operations including CRUD,
 * lifecycle hooks, validation, and optional runtime workflow and business rule integrations.
 *
 * @param <M> the model type extending Table1Base
 */
public class Table1BaseService<M extends Table1Base> extends BaseService<M>
    implements ITable1BaseService<M> {

  private static final Logger logger = LoggerFactory.getLogger(Table1BaseService.class.getName());

  private Table1PerimeterBaseImpl<M> table1PerimeterBaseImpl;

  /**
   * Constructs a new Table1BaseService.
   *
   * @param modelClass the class of the model
   * @param table1Repository the repository for database operations
   * @throws NullPointerException if modelClass or repository is null
   */
  public Table1BaseService(Class<M> modelClass, Table1BaseRepository<M, ?> table1Repository) {
    super(
        Objects.requireNonNull(modelClass, ErrorCode.MODEL_CLASS_MUST_NOT_BE_NULL),
        Objects.requireNonNull(table1Repository, ErrorCode.REPOSITORY_MUST_NOT_BE_NULL));

    addPersistenceOption(DBOptions.DELETE_OPTION, DeleteOptions.PERMANENT_DELETE);
  }

  /**
   * Injects default service dependencies.
   *
   * @param changelogService the changelog service
   * @param table1PerimeterBaseImpl the perimeter implementation
   */
  @Autowired
  protected void injectDefaultService(
      IChangelogService changelogService, Table1PerimeterBaseImpl<M> table1PerimeterBaseImpl) {
    setChangelogService(changelogService);
  }

  /** Sets all required service dependencies. */
  @Autowired
  protected void setDependencies(Table1PerimeterBaseImpl<M> table1PerimeterBaseImpl) {
    setTable1PerimeterBaseImpl(table1PerimeterBaseImpl);
  }

  /**
   * Initializes the service after all properties have been set. Registers model transformers for
   * analytical and search persistence types.
   */
  @Override
  public void afterPropertiesSet() {
    super.afterPropertiesSet();
  }

  /**
   * Returns the additional persistence types supported by this service.
   *
   * @return array of persistence types (e.g., SEARCH, ANALYTICAL)
   */
  @Override
  public PersistenceType[] getOtherPersistenceTypes() {
    return new PersistenceType[0];
  }

  /**
   * Returns the perimeter manager for access control.
   *
   * @return the perimeter manager implementation
   */
  @Override
  protected IPerimeterManager<M> getPerimeterManager() {
    return table1PerimeterBaseImpl;
  }

  /**
   * Sets the perimeter implementation.
   *
   * @param table1PerimeterImpl the perimeter implementation to set
   */
  protected void setTable1PerimeterBaseImpl(Table1PerimeterBaseImpl<M> table1PerimeterImpl) {
    if (this.table1PerimeterBaseImpl == null)
      this.table1PerimeterBaseImpl =
          Objects.requireNonNull(table1PerimeterImpl, ErrorCode.PERIMETER_MUST_NOT_BE_NULL);
  }
}
