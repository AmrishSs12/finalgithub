package com.bmtest.finalgithub.base.service;

import com.bmtest.finalgithub.base.model.ApplicationUserBase;
import com.bmtest.finalgithub.base.model.Roles;
import com.bmtest.finalgithub.base.model.Table1Base;
import com.bmtest.finalgithub.base.model.constants.Table1ConstantBase;
import com.rappit.rd.base.acl.AllowedFields;
import com.rappit.rd.base.acl.IPerimeterManager;
import com.rappit.rd.base.authentication.logic.AppUserPrivilegeCache;
import com.rappit.rd.base.exception.ForbiddenAccessException;
import com.rappit.rd.base.exception.InternalException;
import com.rappit.rd.base.logger.Logger;
import com.rappit.rd.base.logger.LoggerFactory;
import com.rappit.rd.base.repository.providers.PersistenceType;
import com.rappit.rd.base.util.CollectionUtils;
import com.rappit.rd.base.util.ErrorCode;
import com.rappit.rd.base.util.LogConstants;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import org.apache.commons.lang3.BooleanUtils;

public abstract class Table1PerimeterBaseImpl<M extends Table1Base>
    implements IPerimeterManager<M>, Table1ConstantBase {

  private static final Logger logger = LoggerFactory.getLogger(Table1PerimeterBaseImpl.class);

  protected static final List<String> APP_ADMIN_READ_FIELDS =
      List.of(SID, CREATED_BY, CREATED_DATE, MODIFIED_BY, MODIFIED_DATE);

  protected List<String> getAppAdminReadFields() {
    return APP_ADMIN_READ_FIELDS;
  }

  private final AppUserPrivilegeCache<ApplicationUserBase> userCache;

  protected Table1PerimeterBaseImpl(AppUserPrivilegeCache<ApplicationUserBase> userCache) {
    this.userCache = userCache;
  }

  @Override
  public boolean canCreate(M model) {
    logger.logEntry(LogConstants.canCreate, model);
    try {
      ApplicationUserBase userBase = (ApplicationUserBase) userCache.getCurrentUser();
      if (userBase != null && CollectionUtils.isNotEmpty(userBase.getUserRoles())) {
        boolean accessCheck =
            userBase.getUserRoles().stream()
                .map(Roles::getRoleNameEnum)
                .filter(Objects::nonNull)
                .anyMatch(roleName -> Roles.APP_ADMIN.equals(roleName));
        logger.logExit(LogConstants.canCreate, accessCheck);
        return accessCheck;
      } else {
        logger.error("Application user is not available to verify the perimeter create access ");
        throw new InternalException(
            "Application user is not available to verify the perimeter create access ");
      }
    } catch (Exception e) {
      logger.error("Exception while checking the perimeter create action  ", e);
      throw new ForbiddenAccessException(ErrorCode.SAVE_NOT_ALLOWED, e);
    } finally {
      logger.logExit(LogConstants.canCreate);
    }
  }

  @Override
  public boolean canUpdate(M model) {
    logger.logEntry(LogConstants.canUpdate, model);
    try {
      ApplicationUserBase userBase = (ApplicationUserBase) userCache.getCurrentUser();
      if (userBase != null && CollectionUtils.isNotEmpty(userBase.getUserRoles())) {
        boolean accessCheck =
            userBase.getUserRoles().stream()
                .map(Roles::getRoleNameEnum)
                .filter(Objects::nonNull)
                .anyMatch(roleName -> Roles.APP_ADMIN.equals(roleName));
        logger.logExit(LogConstants.canUpdate, accessCheck);
        return accessCheck;
      } else {
        logger.error("Application user is not available to verify the perimeter update access ");
        throw new InternalException(
            "Application user is not available to verify the perimeter update access ");
      }
    } catch (Exception e) {
      logger.error("Exception while checking the perimeter update action  ", e);
      throw new ForbiddenAccessException(ErrorCode.UPDATE_NOT_ALLOWED, e);
    } finally {
      logger.logExit(LogConstants.canUpdate);
    }
  }

  @Override
  public boolean canDelete(M model) {
    logger.logEntry(LogConstants.canDelete, model);
    try {
      ApplicationUserBase userBase = (ApplicationUserBase) userCache.getCurrentUser();
      if (userBase != null && CollectionUtils.isNotEmpty(userBase.getUserRoles())) {
        boolean accessCheck =
            userBase.getUserRoles().stream()
                .map(Roles::getRoleNameEnum)
                .filter(Objects::nonNull)
                .anyMatch(roleName -> Roles.APP_ADMIN.equals(roleName));
        logger.logExit(LogConstants.canDelete, accessCheck);
        return accessCheck;
      } else {
        logger.error("Application user is not available to verify the perimeter delete access ");
        throw new InternalException(
            "Application user is not available to verify the perimeter delete access ");
      }
    } catch (Exception e) {
      logger.error("Exception while checking the perimeter delete actionn  ", e);
      throw new ForbiddenAccessException(ErrorCode.DELETE_NOT_ALLOWED, e);
    } finally {
      logger.logExit(LogConstants.canDelete);
    }
  }

  @Override
  public boolean canRead(M model) {
    logger.logEntry(LogConstants.canRead, model);
    try {
      ApplicationUserBase userBase = (ApplicationUserBase) userCache.getCurrentUser();
      if (userBase != null && CollectionUtils.isNotEmpty(userBase.getUserRoles())) {
        boolean accessCheck =
            userBase.getUserRoles().stream()
                .map(Roles::getRoleNameEnum)
                .filter(Objects::nonNull)
                .anyMatch(roleName -> Roles.APP_ADMIN.equals(roleName));
        logger.logExit(LogConstants.canRead, accessCheck);
        return accessCheck;
      } else {
        logger.error("Application user is not available to verify the perimeter read access ");
        throw new InternalException(
            "Application user is not available to verify perimeter read access ");
      }
    } catch (Exception e) {
      logger.error("Excepton while checking the perimeter action  ", e);
      throw new ForbiddenAccessException(ErrorCode.READ_NOT_ALLOWED, e);
    } finally {
      logger.logExit(LogConstants.canRead);
    }
  }

  @Override
  public String getAccessQuery(PersistenceType type) {
    return null;
  }

  @Override
  public AllowedFields getSelectFields(PersistenceType type) {
    logger.logEntry("getSelectFields", type);
    AllowedFields allowedFields = new AllowedFields();
    ApplicationUserBase userBase = (ApplicationUserBase) userCache.getCurrentUser();
    setReadFields(userBase, allowedFields);
    setWriteFields(userBase, allowedFields);
    logger.logExit("getSelectFields", allowedFields);
    return allowedFields;
  }

  protected void setReadFields(ApplicationUserBase userBase, AllowedFields allowedFields) {
    logger.logEntry(LogConstants.setReadFields, userBase, allowedFields);
    Set<String> allowedAccessFields = new HashSet<>();
    allowedAccessFields.addAll(getTechnicalFields());
    if (userBase == null) {
      List<String> allowedAccessFieldList = new ArrayList<>(allowedAccessFields);
      allowedFields.setAllowedReadFields(allowedAccessFieldList);
      logger.logExit(LogConstants.setReadFields);
      return;
    }
    if (BooleanUtils.isTrue(userBase.isAppAdmin())) {
      allowedAccessFields.addAll(getAppAdminReadFields());
    }

    List<String> allowedAccessFieldList = new ArrayList<>(allowedAccessFields);
    allowedFields.setAllowedReadFields(allowedAccessFieldList);
    logger.logExit(LogConstants.setReadFields);
  }

  protected void setWriteFields(ApplicationUserBase userBase, AllowedFields allowedFields) {
    logger.logEntry(LogConstants.setWriteFields, userBase, allowedFields);
    Set<String> allowedAccessFields = new HashSet<>();
    allowedAccessFields.addAll(getTechnicalFields());
    if (userBase == null) {
      List<String> allowedAccessFieldList = new ArrayList<>(allowedAccessFields);
      allowedFields.setAllowedWriteFields(allowedAccessFieldList);
      logger.logExit(LogConstants.setWriteFields);
      return;
    }

    List<String> allowedAccessFieldList = new ArrayList<>(allowedAccessFields);
    allowedFields.setAllowedWriteFields(allowedAccessFieldList);
    logger.logExit(LogConstants.setWriteFields);
  }

  protected List<String> getTechnicalFields() {
    logger.logEntry("getTechnicalFields");
    String[] technicalFields = {
      "sid", "createdBy", "createdDate", "modifiedBy", "modifiedDate", "recDeleted"
    };
    List<String> technicalFieldList = new ArrayList<>();
    Collections.addAll(technicalFieldList, technicalFields);
    logger.logExit("getTechnicalFields", technicalFieldList);
    return technicalFieldList;
  }
}
