package com.bmtest.finalgithub.base.service;

import com.bmtest.finalgithub.base.model.ApplicationUserBase;
import com.bmtest.finalgithub.base.model.Roles;
import com.bmtest.finalgithub.base.model.constants.ApplicationUserConstantBase;
import com.rappit.rd.base.acl.AllowedFields;
import com.rappit.rd.base.acl.IPerimeterManager;
import com.rappit.rd.base.authentication.logic.AppUserPrivilegeCache;
import com.rappit.rd.base.authentication.model.UserPrivilege;
import com.rappit.rd.base.exception.InternalException;
import com.rappit.rd.base.listener.BaseApplicationConfiguration;
import com.rappit.rd.base.logger.Logger;
import com.rappit.rd.base.logger.LoggerFactory;
import com.rappit.rd.base.repository.providers.PersistenceType;
import com.rappit.rd.base.util.CollectionUtils;
import com.rappit.rd.base.util.ErrorCode;
import com.rappit.rd.base.util.LogConstants;
import com.rappit.rd.security.authentication.WhitelistedAdminUserProvisioningService;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;

public abstract class ApplicationUserPerimeterBaseImpl<M extends ApplicationUserBase>
    implements IPerimeterManager<M>, ApplicationUserConstantBase {

  private static final Logger logger =
      LoggerFactory.getLogger(ApplicationUserPerimeterBaseImpl.class);

  private final AppUserPrivilegeCache<M> userCache;
  private final WhitelistedAdminUserProvisioningService provisioningService;
  private final BaseApplicationConfiguration baseApplicationConfiguration;

  public ApplicationUserPerimeterBaseImpl(
      AppUserPrivilegeCache<M> userCache,
      WhitelistedAdminUserProvisioningService provisioningService,
      BaseApplicationConfiguration baseApplicationConfiguration) {
    this.userCache = userCache;
    this.provisioningService = provisioningService;
    this.baseApplicationConfiguration = baseApplicationConfiguration;
  }

  protected static final List<String> APP_ADMIN_WRITE_FIELDS =
      List.of(
          SID,
          CREATED_BY,
          CREATED_DATE,
          MODIFIED_BY,
          MODIFIED_DATE,
          EMAIL,
          FIRST_NAME,
          LAST_NAME,
          USER_ROLES,
          APP_ADMIN);

  protected List<String> getAppAdminWriteFields() {
    return APP_ADMIN_WRITE_FIELDS;
  }

  protected static final List<String> APP_ADMIN_READ_FIELDS =
      List.of(
          SID,
          CREATED_BY,
          CREATED_DATE,
          MODIFIED_BY,
          MODIFIED_DATE,
          EMAIL,
          FIRST_NAME,
          LAST_NAME,
          USER_ROLES,
          APP_ADMIN);

  protected List<String> getAppAdminReadFields() {
    return APP_ADMIN_READ_FIELDS;
  }

  @Override
  public boolean canCreate(M model) {
    logger.logEntry(LogConstants.canCreate, model);
    try {
      if (Objects.nonNull(model.getEmail())
          && provisioningService.isWhitelistesAdminUser(model.getEmail())) {
        logger.logExit(LogConstants.canCreate, true);
        return true;
      }
      UserPrivilege userPrivilege = userCache.getCurrentUser();
      if (userPrivilege != null && userPrivilege.isJitUser()) {
        logger.logExit(LogConstants.canCreate, true);
        return true;
      }
      ApplicationUserBase userBase = (ApplicationUserBase) userPrivilege;
      if (userBase != null && CollectionUtils.isNotEmpty(userBase.getUserRoles())) {
        boolean isAppAdmin = BooleanUtils.isTrue(userBase.isAppAdmin());
        boolean changeInAppAdminField = BooleanUtils.isTrue(model.isAppAdmin());
        if (!isAppAdmin && changeInAppAdminField) {
          throw new InternalException("You don't have permission to perform this action");
        }
        boolean accessCheck =
            userBase.getUserRoles().stream()
                .map(Roles::getRoleNameEnum)
                .filter(Objects::nonNull)
                .anyMatch(roleName -> Roles.APP_ADMIN.equals(roleName));
        logger.logExit(LogConstants.canCreate, accessCheck);
        return accessCheck;
      } else {
        throw new InternalException(
            "Application user or role not found while verify create perimeter");
      }
    } catch (InternalException e) {
      logger.error("Excetion :{0}", e);
      throw new InternalException(ErrorCode.APPLICATION_USER_ROLE_NOT_EXIST, e);
    } catch (Exception e) {
      logger.error(LogConstants.exception + " :{0}", e);
      throw new InternalException(ErrorCode.PERIMETER_VERIFY_EXCEPTION, e);
      // throw new ForbiddenAccessexception(ErrorCode.SAVE_NOT_ALLOWED,e);
    } finally {
      logger.logExit(LogConstants.canCreate);
    }
  }

  @Override
  public boolean canUpdate(M model) {
    logger.logEntry(LogConstants.canUpdate, model);
    try {
      ApplicationUserBase userBase = userCache.getCurrentUser();
      if (userBase != null
          && userBase.getEmail().equals(model.getEmail())
          && model.isLanguageCodeUpdate()) {
        logger.logExit(LogConstants.canUpdate, true);
        return true;
      }
      if (userBase != null && userBase.getEmail().equals(model.getEmail()) && model.isJitUser()) {
        logger.info("GCIP signup update name is allowed");
        logger.logExit(LogConstants.canUpdate, true);
        return true;
      }
      if (userBase != null && CollectionUtils.isNotEmpty(userBase.getUserRoles())) {
        ApplicationUserBase existingModel = userCache.get(model.getEmail());
        boolean isAppAdmin = BooleanUtils.isTrue(userBase.isAppAdmin());
        boolean changeInAppAdminField =
            (BooleanUtils.isTrue(model.isAppAdmin())
                    && BooleanUtils.isFalse(existingModel.isAppAdmin()))
                || (BooleanUtils.isFalse(model.isAppAdmin())
                    && BooleanUtils.isTrue(existingModel.isAppAdmin()));
        if (!isAppAdmin && changeInAppAdminField) {
          throw new InternalException("You don't have permission to perform this action");
        }
        boolean accessCheck =
            userBase.getUserRoles().stream()
                .map(Roles::getRoleNameEnum)
                .filter(Objects::nonNull)
                .anyMatch(roleName -> Roles.APP_ADMIN.equals(roleName));
        logger.logExit("canUpdate", accessCheck);
        return accessCheck;
      } else {
        throw new InternalException(
            "Application user or role not found while verify update perimeter");
      }
    } catch (InternalException e) {
      logger.error(LogConstants.exception + " :{0}", e);
      throw new InternalException(ErrorCode.APPLICATION_USER_ROLE_NOT_EXIST, e);
    } catch (Exception e) {
      logger.error(LogConstants.exception + " :{0}", e);
      throw new InternalException(ErrorCode.PERIMETER_VERIFY_EXCEPTION, e);
      // throw new ForbiddenAccessexception(ErrorCode.UPDATE_NOT_ALLOWED,e);
    } finally {
      logger.logExit(LogConstants.canUpdate);
    }
  }

  @Override
  public boolean canDelete(M model) {
    logger.logEntry(LogConstants.canDelete, model);
    try {
      ApplicationUserBase userBase = userCache.getCurrentUser();
      if (userBase != null && CollectionUtils.isNotEmpty(userBase.getUserRoles())) {
        boolean accessCheck =
            userBase.getUserRoles().stream()
                .map(Roles::getRoleNameEnum)
                .filter(Objects::nonNull)
                .anyMatch(roleName -> Roles.APP_ADMIN.equals(roleName));
        logger.logExit("canDelete", accessCheck);
        return accessCheck;
      } else {
        throw new InternalException(
            "Application user or role not found while verify delete perimeter");
      }
    } catch (InternalException e) {
      logger.error(LogConstants.exception + " :{0}", e);
      throw new InternalException(ErrorCode.APPLICATION_USER_ROLE_NOT_EXIST, e);
    } catch (Exception e) {
      logger.error(LogConstants.exception + " :{0}", e);
      throw new InternalException(ErrorCode.PERIMETER_VERIFY_EXCEPTION, e);
      //	throw new ForbiddenAccessexception(ErrorCode.DELETE_NOT_ALLOWED,e);
    } finally {
      logger.logExit(LogConstants.canDelete);
    }
  }

  @Override
  public boolean canRead(M model) {
    logger.logEntry(LogConstants.canRead, model);
    try {
      if (provisioningService.isWhitelistesAdminUser(model.getEmail())) {
        logger.logExit(LogConstants.canRead, true);
        return true;
      }
      ApplicationUserBase userBase = userCache.getCurrentUser();
      if (userBase != null
          && StringUtils.equalsIgnoreCase(userBase.getEmail(), model.getEmail())
          && BooleanUtils.isTrue(userBase.isLogin())) {
        logger.logExit(LogConstants.canRead, true);
        return true;
      }

      if (BooleanUtils.isTrue(baseApplicationConfiguration.isAllDomainUsersLogin())
          && StringUtils.isNotBlank(
              baseApplicationConfiguration.getAllDomainUsersMappedAppUser())) {
        if (Objects.nonNull(model)
            && StringUtils.isNotBlank(model.getEmail())
            && model
                .getEmail()
                .equals(baseApplicationConfiguration.getAllDomainUsersMappedAppUser())) {
          logger.logExit(LogConstants.canRead, true);
          return true;
        }
      }

      if (userBase != null && CollectionUtils.isNotEmpty(userBase.getUserRoles())) {
        boolean accessCheck =
            userBase.getUserRoles().stream()
                .map(Roles::getRoleNameEnum)
                .filter(Objects::nonNull)
                .anyMatch(roleName -> Roles.APP_ADMIN.equals(roleName));
        logger.logExit("canRead", accessCheck);
        return accessCheck;
      } else {
        throw new InternalException(
            "Application user or role not found while verify read perimeter");
      }
    } catch (InternalException e) {
      logger.error(LogConstants.exception + " :", e);
      throw new InternalException(ErrorCode.APPLICATION_USER_ROLE_NOT_EXIST, e);
    } catch (Exception e) {
      logger.error(LogConstants.exception + " :", e);
      throw new InternalException(ErrorCode.PERIMETER_VERIFY_EXCEPTION, e);
      //		throw new ForbiddenAccessexception(ErrorCode.READ_NOT_ALLOWED,e);
    } finally {
      logger.logExit(LogConstants.canRead);
    }
  }

  @Override
  public String getAccessQuery(PersistenceType type) {
    logger.logEntry("getAccessQuery", type);
    logger.logExit("getAccessQuery");
    return null;
  }

  @Override
  public AllowedFields getSelectFields(PersistenceType type) {
    logger.logEntry("getSelectFields", type);
    AllowedFields allowedFields = new AllowedFields();
    ApplicationUserBase userBase = userCache.getCurrentUser();
    setReadFields(userBase, allowedFields);
    setWriteFields(userBase, allowedFields);
    logger.logExit("getSelectFields", allowedFields);
    return allowedFields;
  }

  protected void setReadFields(ApplicationUserBase userBase, AllowedFields allowedFields) {
    logger.logEntry(LogConstants.setReadFields, userBase, allowedFields);
    Set<String> allowedAccessFields = new HashSet<>();
    allowedAccessFields.addAll(getTechnicalFields());
    if (userBase != null) {
      if (BooleanUtils.isTrue(userBase.isAppAdmin())) {
        allowedAccessFields.addAll(getAppAdminReadFields());
      }

      if (provisioningService.isWhitelistesAdminUser(userBase.getEmail())
          || BooleanUtils.isTrue(userBase.isLogin())) {
        allowedAccessFields.add("*");
        List<String> allowedAccessFieldList = new ArrayList<>(allowedAccessFields);
        allowedFields.setAllowedReadFields(allowedAccessFieldList);
        logger.logExit(LogConstants.setReadFields);
        return;
      }
    }

    List<String> allowedAccessFieldList = new ArrayList<>(allowedAccessFields);
    allowedFields.setAllowedReadFields(allowedAccessFieldList);
    logger.logExit(LogConstants.setReadFields);
  }

  protected void setWriteFields(ApplicationUserBase userBase, AllowedFields allowedFields) {
    logger.logEntry(LogConstants.setWriteFields, userBase, allowedFields);
    Set<String> allowedAccessFields = new HashSet<>();
    allowedAccessFields.addAll(getTechnicalFields());
    if (userBase != null) {
      if (BooleanUtils.isTrue(userBase.isAppAdmin())) {
        allowedAccessFields.addAll(getAppAdminWriteFields());
      }

      if (provisioningService.isWhitelistesAdminUser(userBase.getEmail())
          || BooleanUtils.isTrue(userBase.isLogin())) {
        allowedAccessFields.add("*");
        List<String> allowedAccessFieldList = new ArrayList<>(allowedAccessFields);
        allowedFields.setAllowedWriteFields(allowedAccessFieldList);
        logger.logExit(LogConstants.setWriteFields);
        return;
      }
    }
    List<String> allowedAccessFieldList = new ArrayList<>(allowedAccessFields);
    allowedFields.setAllowedWriteFields(allowedAccessFieldList);
    logger.logExit(LogConstants.setWriteFields);
  }

  protected List<String> getTechnicalFields() {
    logger.logEntry("getTechnicalFields");
    String[] technicalFields = {
      "languageCode",
      "sid",
      "createdBy",
      "createdDate",
      "modifiedBy",
      "modifiedDate",
      "recDeleted",
      "emailInLowerCase",
      "userRoles",
      "email",
      "firstName",
      "lastName"
    };
    List<String> technicalFieldList = new ArrayList<>();
    Collections.addAll(technicalFieldList, technicalFields);
    logger.logExit("getTechnicalFields", technicalFieldList);
    return technicalFieldList;
  }
}
