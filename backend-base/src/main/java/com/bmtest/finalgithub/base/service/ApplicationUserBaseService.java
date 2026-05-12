package com.bmtest.finalgithub.base.service;

import com.bmtest.finalgithub.base.infrastructure.exception.ErrorCodes;
import com.bmtest.finalgithub.base.infrastructure.exception.ErrorMessages;
import com.bmtest.finalgithub.base.model.ApplicationUserBase;
import com.bmtest.finalgithub.base.model.Roles;
import com.bmtest.finalgithub.base.model.constants.DefaultFieldsConstantBase;
import com.bmtest.finalgithub.base.repository.ApplicationUserBaseRepository;
import com.rappit.rd.base.acl.IPerimeterManager;
import com.rappit.rd.base.appconfiguration.AppConfigurationCache;
import com.rappit.rd.base.authentication.UserContextThreadLocal;
import com.rappit.rd.base.authentication.logic.AppUserPrivilegeCache;
import com.rappit.rd.base.authentication.model.UserPrivilege;
import com.rappit.rd.base.cache.MenuCache;
import com.rappit.rd.base.exception.ForbiddenException;
import com.rappit.rd.base.exception.ValidationError;
import com.rappit.rd.base.listener.BaseApplicationConfiguration;
import com.rappit.rd.base.logger.Logger;
import com.rappit.rd.base.logger.LoggerFactory;
import com.rappit.rd.base.logic.BaseService;
import com.rappit.rd.base.mail.model.EmailAddress;
import com.rappit.rd.base.model.wrapper.UserPrivilegePerimeter;
import com.rappit.rd.base.repository.Filter;
import com.rappit.rd.base.repository.Filter.Operator;
import com.rappit.rd.base.repository.SimpleFilter;
import com.rappit.rd.base.repository.Sort;
import com.rappit.rd.base.repository.Sort.Direction;
import com.rappit.rd.base.repository.providers.AnalyticalOptions;
import com.rappit.rd.base.repository.providers.DBOptions;
import com.rappit.rd.base.repository.providers.DeleteOptions;
import com.rappit.rd.base.repository.providers.PersistenceType;
import com.rappit.rd.base.service.changelog.IChangelogService;
import com.rappit.rd.base.user.menu.MenuRoleUtil;
import com.rappit.rd.base.util.Constants;
import com.rappit.rd.base.util.ErrorCode;
import com.rappit.rd.base.util.EvaUtils;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

/**
 * Base service class for ApplicationUser entity. Provides business logic operations for user
 * management including CRUD, authentication, role management, and cache invalidation.
 *
 * @param <M> the model type extending ApplicationUserBase
 */
public abstract class ApplicationUserBaseService<M extends ApplicationUserBase>
    extends BaseService<M> implements IApplicationUserBaseService<M> {
  // Fields and Constants

  private static final Logger logger = LoggerFactory.getLogger(ApplicationUserBaseService.class);
  String applicationUser = "ApplicationUser";
  String getUsersByRole = "getUsersByRole";
  String email = "email";
  String updateUserLang = "updateUserLang";
  String updateName = "updateName";
  protected final ApplicationUserBaseRepository applicationUserBaseRepository;

  private AppUserPrivilegeCache<M> userCache;
  private AppConfigurationCache appConfigCache;
  private ApplicationUserPerimeterBaseImpl applicationUserPerimeterBaseImpl;
  private ApplicationUserAnalyticalTransformer applicationUserAnalyticalTransformer;
  private IChangelogService changelogService;
  private BaseApplicationConfiguration baseApplicationConfiguration;
  private MenuRoleUtil menuRoleUtil;
  private MenuCache menuCache;

  // Constructors

  /**
   * Constructs a new ApplicationUserBaseService.
   *
   * @param modelClass the class of the model
   * @param applicationUserBaseRepository the repository for database operations
   */
  protected ApplicationUserBaseService(
      Class<M> modelClass, ApplicationUserBaseRepository applicationUserBaseRepository) {
    super(modelClass, applicationUserBaseRepository);
    this.applicationUserBaseRepository = applicationUserBaseRepository;
    addPersistenceOption(DBOptions.DELETE_OPTION, DeleteOptions.PERMANENT_DELETE);
  }

  // Dependency Injection

  /**
   * Injects default service dependencies.
   *
   * @param changelogService the changelog service
   * @param applicationUserPerimeterBaseImpl the perimeter implementation
   */
  @Autowired
  public void injectDefaultService(
      IChangelogService changelogService,
      ApplicationUserPerimeterBaseImpl<M> applicationUserPerimeterBaseImpl,
      ApplicationUserAnalyticalTransformer applicationUserAnalyticalTransformer) {
    setApplicationUserPerimeterBaseImpl(applicationUserPerimeterBaseImpl);
    setChangelogService(changelogService);
    setApplicationUserAnalyticalTransformer(applicationUserAnalyticalTransformer);
  }

  /** Sets all required service dependencies. */
  @Autowired
  public void setDependencies(
      AppUserPrivilegeCache<M> userCache,
      AppConfigurationCache appConfigCache,
      ApplicationUserPerimeterBaseImpl<M> applicationUserPerimeterBaseImpl,
      BaseApplicationConfiguration baseApplicationConfiguration,
      IChangelogService changelogService,
      MenuRoleUtil menuRoleUtil,
      MenuCache menuCache) {
    this.userCache = userCache;
    this.appConfigCache = appConfigCache;
    this.applicationUserPerimeterBaseImpl = applicationUserPerimeterBaseImpl;
    this.changelogService = changelogService;
    this.menuRoleUtil = menuRoleUtil;
    this.menuCache = menuCache;

    this.baseApplicationConfiguration = baseApplicationConfiguration;
  }

  // Initialization Methods

  /**
   * Initializes the service after all properties have been set. Registers model transformers for
   * analytical and search persistence types.
   */
  @Override
  public void afterPropertiesSet() {
    super.afterPropertiesSet();
    addPersistenceOption(AnalyticalOptions.GROUP_NAME, "app_default_tables");
    registerModelTransformer(PersistenceType.ANALYTICAL, applicationUserAnalyticalTransformer);
  }

  // Interface Implementation Methods

  /**
   * Returns the additional persistence types supported by this service.
   *
   * @return array of persistence types (e.g., SEARCH, ANALYTICAL)
   */
  @Override
  public PersistenceType[] getOtherPersistenceTypes() {
    return new PersistenceType[] {PersistenceType.ANALYTICAL};
  }

  /**
   * Returns the perimeter manager for access control.
   *
   * @return the perimeter manager implementation
   */
  protected IPerimeterManager<M> getPerimeterManager() {
    return applicationUserPerimeterBaseImpl;
  }

  // Save Lifecycle Hooks

  /**
   * Lifecycle hook called before saving an entity. Delegates to type-specific handlers based on
   * persistence type.
   *
   * @param type the persistence type (DB, SEARCH, ANALYTICAL)
   * @param modelObj the model object being saved
   */
  @Override
  public final void onBeforeSave(PersistenceType type, M modelObj) {
    logger.logEntry("onBeforeSave", type, modelObj);
    switch (type) {
      case DB:
        onBeforeSaveDB(modelObj);
        break;
      case SEARCH:
        onBeforeSaveSearch(modelObj);
        break;
      default:
        break;
    }
    super.onBeforeSave(type, modelObj);
    logger.logExit("onBeforeSave");
  }

  /**
   * Database-specific pre-save hook. Normalizes email, calculates fields, validates existence, and
   * sets roles.
   *
   * @param modelObj the model object being saved
   */
  public void onBeforeSaveDB(M modelObj) {
    logger.logEntry("onBeforeSaveDB", modelObj);
    if (modelObj.getEmail() != null) {
      modelObj.setEmailInLowerCase(modelObj.getEmail().toLowerCase());
    }
    setRoles(modelObj);
    logger.logExit("onBeforeSaveDB");
  }

  /**
   * Search-specific pre-save hook. Override to add custom logic before saving to search index.
   *
   * @param modelObj the model object being saved
   */
  public void onBeforeSaveSearch(M modelObj) {}

  /**
   * Lifecycle hook called after saving an entity. Delegates to type-specific handlers.
   *
   * @param type the persistence type (DB, SEARCH, ANALYTICAL)
   * @param modelObj the model object that was saved
   */
  @Override
  public final void onAfterSave(PersistenceType type, Object modelObj) {
    logger.logEntry("onAfterSave", type, modelObj);
    super.onAfterSave(type, modelObj);
    switch (type) {
      case DB:
        onAfterSaveDB((M) modelObj);
        break;
      default:
        break;
    }
    logger.logExit("onAfterSave");
  }

  /**
   * Database-specific post-save hook. Creates changelog and invalidates user cache.
   *
   * @param modelObj the model object that was saved
   */
  public void onAfterSaveDB(M modelObj) {
    logger.logEntry("onAfterSaveDB", modelObj);
    changelogService.createChangeLog(
        applicationUser, modelObj.getSid().toString(), Constants.SAVED, modelObj);
    invalidateCache(modelObj);
    logger.logExit("onAfterSaveDB");
  }

  // Update Lifecycle Hooks

  /**
   * Lifecycle hook called before updating an entity. Delegates to type-specific handlers.
   *
   * @param type the persistence type (DB, SEARCH, ANALYTICAL)
   * @param modelObj the model object being updated
   */
  @Override
  public final void onBeforeUpdate(PersistenceType type, M modelObj) {
    logger.logEntry("onBeforeUpdate", type, modelObj);
    switch (type) {
      case DB:
        onBeforeUpdateDB(modelObj);
        break;
      case SEARCH:
        onBeforeUpdateSearch(modelObj);
        break;
      default:
        break;
    }
    super.onBeforeUpdate(type, modelObj);
    logger.logExit("onBeforeUpdate");
  }

  /**
   * Database-specific pre-update hook. Normalizes email, calculates fields, validates existence,
   * sets roles, and handles attachments.
   *
   * @param modelObj the model object being updated
   */
  public void onBeforeUpdateDB(M modelObj) {
    logger.logEntry("onBeforeUpdateDB", modelObj);
    if (modelObj.getEmail() != null) {
      modelObj.setEmailInLowerCase(modelObj.getEmail().toLowerCase());
    }
    setRoles(modelObj);
    logger.logExit("onBeforeUpdateDB");
  }

  /**
   * Search-specific pre-update hook. Override to add custom logic before updating search index.
   *
   * @param modelObj the model object being updated
   */
  public void onBeforeUpdateSearch(M modelObj) {}

  /**
   * Lifecycle hook called after updating an entity. Delegates to type-specific handlers.
   *
   * @param type the persistence type (DB, SEARCH, ANALYTICAL)
   * @param modelObj the model object that was updated
   */
  @Override
  public final void onAfterUpdate(PersistenceType type, Object modelObj) {
    logger.logEntry("onAfterUpdate", type, modelObj);
    switch (type) {
      case DB:
        onAfterUpdateDB((M) modelObj);
        break;
      default:
        break;
    }
    super.onAfterUpdate(type, modelObj);
    logger.logExit("onAfterUpdate");
  }

  /**
   * Database-specific post-update hook. Creates changelog, triggers propagation, and invalidates
   * caches.
   *
   * @param modelObj the model object that was updated
   */
  public void onAfterUpdateDB(M modelObj) {
    logger.logEntry("onAfterUpdateDB", modelObj);
    changelogService.createChangeLog(
        applicationUser, modelObj.getSid().toString(), Constants.UPDATED, modelObj);
    invalidateCache(modelObj);
    logger.logExit("onAfterUpdateDB");
  }

  // Delete Lifecycle Hooks

  /**
   * Lifecycle hook called before deleting an entity. Delegates to type-specific handlers.
   *
   * @param type the persistence type (DB, SEARCH, ANALYTICAL)
   * @param modelObj the model object being deleted
   */
  @Override
  public void onBeforeDelete(PersistenceType type, M modelObj) {
    logger.logEntry("onBeforeDelete", type, modelObj);
    switch (type) {
      case DB:
        onBeforeDeleteDB(modelObj);
        break;
      default:
        break;
    }
    logger.logExit("onBeforeDelete");
    super.onBeforeDelete(type, modelObj);
  }

  /**
   * Database-specific pre-delete hook. Handles attachment cleanup before deletion.
   *
   * @param modelObj the model object being deleted
   */
  public void onBeforeDeleteDB(M modelObj) {
    logger.logEntry("onBeforeDeleteDB", modelObj);
    logger.logExit("onBeforeDeleteDB");
  }

  /**
   * Database-specific post-delete hook. Creates changelog and invalidates user cache.
   *
   * @param modelObj the model object that was deleted
   */
  public void onAfterDeleteDB(M modelObj) {
    logger.logEntry("onAfterDeleteDB", modelObj);
    changelogService.createChangeLog(
        applicationUser, modelObj.getSid().toString(), Constants.DELETED, modelObj);
    userCache.invalidate(modelObj.getEmail());
    logger.logExit("onAfterDeleteDB");
  }

  // Soft Delete Lifecycle Hooks (Deactivate/Activate)

  // Validation Hooks

  /**
   * Hook called before generated validation rules are executed. Override to add custom
   * pre-validation logic.
   *
   * @return list of validation messages to add
   */
  @Override
  public List<String> onBeforeGeneratedValidation() {
    return Collections.emptyList();
  }

  /**
   * Hook called after generated validation rules are executed. Override to add custom
   * post-validation logic.
   *
   * @param validationErrors list of validation errors found
   */
  @Override
  public void onAfterGeneratedValidation(List<ValidationError> validationErrors) {}

  // User Management Methods

  /**
   * Creates an admin user with the specified email.
   *
   * @param email the admin user's email address
   * @return the created admin user
   */
  @Override
  @Transactional
  public M createAdminUser(String email) {
    M user = getModelInstance();
    user.setEmail(email);
    user.setAppAdmin(true);
    populateUserName(email, user);
    List<String> role = new ArrayList<>();
    role.add(Roles.APP_ADMIN.getRoleName());
    user.setUserRoles(role);
    user.setLogin(true);
    return super.save(user);
  }

  /**
   * Creates a new user with the specified details.
   *
   * @param userEmail the user's email address
   * @param userFirstName the user's first name
   * @param userLastName the user's last name
   * @param rolesList list of roles to assign
   * @return the created user
   */
  @Override
  @Transactional
  public M createUser(
      String userEmail, String userFirstName, String userLastName, List<String> rolesList) {
    M user = getModelInstance();
    user.setEmail(userEmail);
    user.setFirstName(userFirstName);
    user.setLastName(userLastName);
    if (rolesList != null && rolesList.contains(Roles.APP_ADMIN.getRoleName())) {
      user.setAppAdmin(true);
    }
    user.setUserRoles(rolesList);
    user.setLogin(true);
    return super.save(user);
  }

  /**
   * Creates or updates an application user based on email existence.
   *
   * @param model the application user model
   * @return the created or updated application user
   */
  @Override
  @Transactional
  public M createOrUpdateAppUser(M model) {
    logger.logEntry("createOrUpdateAppUser", model);
    M existingUser = super.getById(model.getEmail());
    M result;
    if (existingUser == null) {
      result = super.save(model);
    } else {
      result = super.update(model);
    }
    logger.logExit("createOrUpdateAppUser", result);
    return result;
  }

  /**
   * Retrieves users by role with perimeter filtering and pagination.
   *
   * @param rolePerimeterInfo the role and perimeter information
   * @param page the page number
   * @param pageSize the page size
   * @return list of email addresses for users matching the criteria
   */
  public List<EmailAddress> getUsersByRole(
      UserPrivilegePerimeter rolePerimeterInfo, Integer page, Integer pageSize) {
    logger.logEntry(getUsersByRole, rolePerimeterInfo, page, pageSize);
    List<Filter> filters = new ArrayList<>();
    Map<String, List<Object>> perimeters = rolePerimeterInfo.getPerimeters();
    boolean perimeterApplicable = perimeters != null && perimeters.size() > 0;
    if (perimeterApplicable) {
      perimeters.forEach(
          (perimeterKey, perimeterValue) ->
              filters.add(new SimpleFilter(perimeterKey, perimeterValue, Filter.Operator.IN)));
      if (filters.isEmpty()) {
        logger.logExit(getUsersByRole, Collections.emptyList());
        return Collections.emptyList();
      }
    }
    filters.add(new SimpleFilter(rolePerimeterInfo.getRoleShortName(), true));
    List<Sort> sorts = new ArrayList<>(1);
    sorts.add(new Sort(email, Direction.ASC));
    List<String> projectedFields = new ArrayList<>(3);
    projectedFields.add(email);
    projectedFields.add("firstName");
    projectedFields.add("lastName");
    List<M> responseList =
        (List<M>)
            getAllByPage(PersistenceType.SEARCH, filters, sorts, page, pageSize, projectedFields);
    if (CollectionUtils.isEmpty(responseList)) {
      logger.logExit(getUsersByRole, Collections.emptyList());
      return Collections.emptyList();
    }
    List<EmailAddress> emailInfoList = new ArrayList<>(responseList.size());
    responseList.forEach(
        data ->
            emailInfoList.add(
                new EmailAddress(
                    data.getEmail(),
                    data.getFirstName()
                        + (StringUtils.isNotBlank(data.getLastName())
                            ? data.getLastName()
                            : StringUtils.EMPTY))));
    logger.logExit(getUsersByRole, emailInfoList);
    return emailInfoList;
  }

  /**
   * Retrieves all available roles as a map.
   *
   * @return map of role names to their display values
   */
  @Transactional(readOnly = true)
  @Override
  public Map<String, String> getAllRolesMap() {
    logger.logEntry("getAllRolesMap");
    Map<String, String> rolesMap = new HashMap<>();
    for (Roles roleNameEnum : Roles.values()) {
      rolesMap.put(
          roleNameEnum.getRoleName(),
          EvaUtils.camelCase(roleNameEnum.toString().toLowerCase(), false, '_'));
    }
    logger.logExit("getAllRolesMap", rolesMap);
    return rolesMap;
  }

  /**
   * Updates the language preference for the current user.
   *
   * @param userLanguage map containing the language code
   * @return true if update was successful, false otherwise
   */
  @Transactional
  public boolean updateUserLang(Map<String, String> userLanguage) {
    logger.logEntry(updateUserLang, userLanguage);
    UserPrivilege user = this.getCurrentUser();
    if (user != null) {
      user.setLanguageCodeUpdate(true);
      ((UserPrivilege) user).setLanguageCode(userLanguage.get("languageCode").toString());
      super.update((M) user);
      logger.logExit(updateUserLang, true);
      return true;
    } else {
      logger.logExit(updateUserLang, false);
      return false;
    }
  }

  /**
   * Updates the name for the current user.
   *
   * @param requestBody map containing firstName and lastName
   * @return true if update was successful, false otherwise
   */
  @Transactional
  public boolean updateName(Map<String, String> requestBody) {
    logger.logEntry(updateName, requestBody);
    UserPrivilege user = this.getCurrentUser();
    String firstName = requestBody.get(DefaultFieldsConstantBase.FIRST_NAME);
    String lastName = requestBody.get(DefaultFieldsConstantBase.LAST_NAME);
    if (user != null) {
      user.setFirstName(firstName);
      user.setLastName(lastName);
      user.setJitUser(true);
      super.update((M) user);
      logger.logExit(updateName, true);
      return true;
    } else {
      logger.logExit(updateName, false);
      return false;
    }
  }

  /**
   * Checks if the user table is empty.
   *
   * @return true if the table is empty, false otherwise
   */
  @Override
  public boolean isTableEmpty() {
    logger.logEntry("isTableEmpty");
    boolean isEmpty = isTableEmpty(PersistenceType.DB);
    logger.logExit("isTableEmpty", isEmpty);
    return isEmpty;
  }

  /**
   * Retrieves an entity by its index fields.
   *
   * @return the matching entity, or null if not found
   */
  @Transactional(readOnly = true)
  @Override
  public M getBysiduniqueIndex(String sid) {
    logger.logEntry("getBysiduniqueIndex");
    List<Filter> filters = new ArrayList<>();
    filters.add(new SimpleFilter("sid", sid, Operator.EQUAL));
    List<M> getAllList = super.getAllRecords(filters);
    if (getAllList != null && !getAllList.isEmpty()) {
      M models = getAllList.get(0);
      logger.logExit("getBysiduniqueIndex", models);
      return models;
    } else {
      logger.logExit("getBysiduniqueIndex");
      return null;
    }
  }

  /**
   * Retrieves an entity by its index fields.
   *
   * @return the matching entity, or null if not found
   */
  @Transactional(readOnly = true)
  @Override
  public M getByemailprimaryIndex(String email) {
    logger.logEntry("getByemailprimaryIndex");
    List<Filter> filters = new ArrayList<>();
    filters.add(new SimpleFilter("email", email, Operator.EQUAL));
    List<M> getAllList = super.getAllRecords(filters);
    if (getAllList != null && !getAllList.isEmpty()) {
      M models = getAllList.get(0);
      logger.logExit("getByemailprimaryIndex", models);
      return models;
    } else {
      logger.logExit("getByemailprimaryIndex");
      return null;
    }
  }

  // Role Management Methods

  /**
   * Sets user roles based on role conditions.
   *
   * @param modelObj the application user model
   */
  protected void setRoles(M modelObj) {
    logger.logEntry("setRoles", modelObj);
    List<String> userRoles = new ArrayList<>();
    if (BooleanUtils.isTrue(modelObj.isAppAdmin())) {
      userRoles.add(Roles.APP_ADMIN.getRoleName());
    }
    modelObj.setUserRoles(userRoles);
    logger.logExit("setRoles");
  }

  // Calculated Field Methods

  // Current User & Menu Methods

  @Override
  public M getCurrentUserWithMenu() {
    M user = getCurrentUser();
    if (null == user) {
      logger.error(ErrorMessages.USER_NOT_AUTHENTICATED);
      throw new ForbiddenException(
          ErrorCodes.USER_NOT_AUTHENTICATED, ErrorMessages.USER_NOT_AUTHENTICATED);
    }
    user.setMenuRole(getMenuBasedOnUser());
    return user;
  }

  @Override
  public M getCurrentUser() {
    return getCurrentUser(false);
  }

  @Override
  public M getCurrentUser(boolean isUserId) {
    return (M) UserContextThreadLocal.getCurrentUserContext();
  }

  public String getMenuBasedOnUser() {
    M userPrivilege = getCurrentUser();
    return menuRoleUtil.menuBasedonRoles(userPrivilege.getUserRoles(), menuCache.query("Menu"));
  }

  @Override
  public M getApplicationUserWithEmail(String email) {
    M user = getModelInstance();
    user.setEmail(email);
    user.setLogin(true);
    return user;
  }

  // Lookup Mapping Methods

  // Search Propagation Methods

  // Protected Setter Methods

  /**
   * Sets the changelog service.
   *
   * @param changelogService the changelog service to set
   */
  public void setChangelogService(IChangelogService changelogService) {
    logger.logEntry("setChangelogService", changelogService);
    this.changelogService = changelogService;
    logger.logExit("setChangelogService");
  }

  /**
   * Sets the analytical transformer.
   *
   * @param applicationUserAnalyticalTransformer the analytical transformer to set
   */
  protected void setApplicationUserAnalyticalTransformer(
      ApplicationUserAnalyticalTransformer applicationUserAnalyticalTransformer) {
    if (this.applicationUserAnalyticalTransformer == null)
      this.applicationUserAnalyticalTransformer =
          Objects.requireNonNull(
              applicationUserAnalyticalTransformer, ErrorCode.TRANSFORMER_MUST_NOT_BE_NULL);
  }

  /**
   * Sets the perimeter implementation.
   *
   * @param applicationUserPerimeterBaseImpl the perimeter implementation to set
   */
  protected void setApplicationUserPerimeterBaseImpl(
      ApplicationUserPerimeterBaseImpl applicationUserPerimeterBaseImpl) {
    if (this.applicationUserPerimeterBaseImpl == null)
      this.applicationUserPerimeterBaseImpl =
          Objects.requireNonNull(
              applicationUserPerimeterBaseImpl, ErrorCode.PERIMETER_MUST_NOT_BE_NULL);
  }

  // Private Helper Methods

  /**
   * Populates username from admin user configuration.
   *
   * @param email the user's email
   * @param user the user model to populate
   */
  private void populateUserName(String email, M user) {
    List<String> adminUserEmails = baseApplicationConfiguration.getAdminUserEmails();
    List<String> adminUserFirstNames = baseApplicationConfiguration.getAdminUserFirstNames();
    List<String> adminUserLastNames = baseApplicationConfiguration.getAdminUserLastNames();
    String firstName = email, lastName = email;

    if (CollectionUtils.isNotEmpty(adminUserEmails)
        && CollectionUtils.isNotEmpty(adminUserFirstNames)) {
      int index = adminUserEmails.indexOf(email);
      if (index != -1 && index <= (adminUserFirstNames.size() - 1)) {
        String adminUserFirstName = adminUserFirstNames.get(index);
        if (StringUtils.isNotBlank(adminUserFirstName)) {
          firstName = adminUserFirstName;
        }
      }
    }
    if (CollectionUtils.isNotEmpty(adminUserEmails)
        && CollectionUtils.isNotEmpty(adminUserLastNames)) {
      int index = adminUserEmails.indexOf(email);
      if (index != -1 && index <= (adminUserLastNames.size() - 1)) {
        String adminUserLastName = adminUserLastNames.get(index);
        if (StringUtils.isNotBlank(adminUserLastName)) {
          lastName = adminUserLastName;
        }
      }
    }
    user.setFirstName(firstName);
    user.setLastName(lastName);
  }

  /**
   * Invalidates and refreshes the user cache.
   *
   * @param modelObj the user model to cache
   */
  private void invalidateCache(M modelObj) {
    logger.logEntry("invalidateCache", modelObj);
    userCache.invalidate(modelObj.getEmail());
    // Removing old data from cache and adding updated data
    if (modelObj != null && modelObj.getEmail() != null) {
      userCache.set(modelObj.getEmail(), modelObj);
    }
    logger.logExit("invalidateCache");
  }
}
