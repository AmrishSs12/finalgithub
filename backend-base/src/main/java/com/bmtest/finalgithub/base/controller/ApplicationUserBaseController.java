package com.bmtest.finalgithub.base.controller;

import com.bmtest.finalgithub.base.model.ApplicationUserBase;
import com.bmtest.finalgithub.base.service.IApplicationUserBaseService;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.rappit.rd.base.annotations.Traced;
import com.rappit.rd.base.authentication.logic.AppUserPrivilegeCache;
import com.rappit.rd.base.controller.BaseController;
import com.rappit.rd.base.exception.InternalException;
import com.rappit.rd.base.logger.Logger;
import com.rappit.rd.base.logger.LoggerFactory;
import com.rappit.rd.base.repository.Filter;
import com.rappit.rd.base.util.ErrorCode;
import com.rappit.rd.base.util.LogConstants;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Base controller for ApplicationUser entity. Provides REST API endpoints for user management,
 * authentication, and role operations.
 *
 * @param <M> the model type extending ApplicationUserBase
 */
public class ApplicationUserBaseController<M extends ApplicationUserBase>
    extends BaseController<M, M> {

  private static final Logger logger = LoggerFactory.getLogger(ApplicationUserBaseController.class);
  protected IApplicationUserBaseService<M> service;
  String message = "message";

  private AppUserPrivilegeCache<M> userCache;

  /**
   * Sets the application user privilege cache.
   *
   * @param userCache the user privilege cache to set
   */
  @Autowired
  public void setAppUserPrivilegeCache(AppUserPrivilegeCache<M> userCache) {
    this.userCache = userCache;
  }

  /**
   * Constructs a new ApplicationUserBaseController with the specified service.
   *
   * @param service the service for ApplicationUser operations
   * @throws NullPointerException if service is null
   */
  public ApplicationUserBaseController(IApplicationUserBaseService service) {
    super(service);
    this.service = Objects.requireNonNull(service, ErrorCode.SERVICE_MUST_NOT_BE_NULL);
  }

  /**
   * Retrieves the current authenticated user's details including menu access.
   *
   * @return the current user with menu information
   */
  @GetMapping("user-details")
  @Traced
  public M getCurrentUser() {
    logger.logEntry("getCurrentUser");
    M model = service.getCurrentUserWithMenu();
    logger.logExit("getCurrentUser", model);
    return model;
  }

  /**
   * Retrieves all available roles in the system.
   *
   * @return map of role identifiers to role names
   */
  @GetMapping("roles")
  @Traced
  public Map<String, String> getRoles() {
    logger.logEntry("getRoles");
    Map<String, String> roles = service.getAllRolesMap();
    logger.logExit("getRoles", roles);
    return roles;
  }

  /**
   * Creates a new application user.
   *
   * @param payload the user data to create
   * @return the created user
   */
  public M create(@RequestBody M payload) {
    logger.logEntry("create", payload);
    M model = service.createOrUpdateAppUser(payload);
    logger.logExit("create", model);
    return model;
  }

  /**
   * Updates the language preference for the current user.
   *
   * @param userLanguage map containing the language code to set
   * @return true if language was updated successfully, false otherwise
   */
  @PutMapping("/userlanguage")
  @Traced
  public boolean updateUserLanguage(@RequestBody Map<String, String> userLanguage) {
    logger.logEntry("updateUserLanguage", userLanguage);
    boolean languageUpdated = service.updateUserLang(userLanguage);
    logger.logExit("updateUserLanguage", languageUpdated);
    return languageUpdated;
  }

  /**
   * Updates the name of the current user.
   *
   * @param requestBody map containing the new name value
   * @return true if name was updated successfully, false otherwise
   */
  @PutMapping("/name")
  @Traced
  public boolean updateName(@RequestBody Map<String, String> requestBody) {
    logger.logEntry(LogConstants.updateName, requestBody);
    boolean languageUpdated = service.updateName(requestBody);
    logger.logExit(LogConstants.updateName, languageUpdated);
    return languageUpdated;
  }

  /**
   * Provides auto-suggest functionality for application users.
   *
   * @param queryParams the query parameters for filtering suggestions
   * @return list of suggested user objects
   */
  @GetMapping(path = "/autosuggest", produces = "application/json")
  @Traced
  public List<Object> autoSuggestService(@RequestParam MultiValueMap<String, Object> queryParams) {
    logger.logEntry("autoSuggestService", queryParams);
    Map<String, Object> params = queryParams.toSingleValueMap();
    List<Filter> filters = new ArrayList<>();

    List<Object> autoSuggest = super.autosuggest(filters, params);
    logger.logExit("autoSuggestService", autoSuggest);
    return autoSuggest;
  }

  /**
   * Retrieves a ApplicationUser entity by index.
   *
   * @return the entity matching the index criteria
   */
  @GetMapping(path = "/getbysidunique/{sid}", produces = "application/json")
  @Traced
  public M getBysiduniqueIndex(@PathVariable("sid") String sid) {
    logger.logEntry("getBysiduniqueIndex");
    M model = service.getBysiduniqueIndex(sid);
    logger.logExit("getBysiduniqueIndex", model);
    return model;
  }

  /**
   * Retrieves a ApplicationUser entity by index.
   *
   * @return the entity matching the index criteria
   */
  @GetMapping(path = "/getbyemailprimary/{email}", produces = "application/json")
  @Traced
  public M getByemailprimaryIndex(@PathVariable("email") String email) {
    logger.logEntry("getByemailprimaryIndex");
    M model = service.getByemailprimaryIndex(email);
    logger.logExit("getByemailprimaryIndex", model);
    return model;
  }

  /**
   * Processes Pub/Sub message to invalidate user cache. This endpoint is called when a user's data
   * changes and their cache needs to be cleared.
   *
   * @param objectNode the Pub/Sub message containing the user email to invalidate
   * @return ResponseEntity with success message
   * @throws InternalException if the message is invalid or empty
   */
  @PostMapping(path = "/invalidateAppUser")
  @Traced
  public ResponseEntity<String> processMessage(@RequestBody ObjectNode objectNode) {
    logger.logEntry("processMessage", objectNode);
    try {
      if (objectNode == null) {
        logger.error("The recieved pubsub message is invalid or empty.");
        throw new InternalException("The recieved pubsub message is invalid or empty.");
      }
      logger.debug("processMessage : objectNode : " + objectNode);
      if (objectNode.has(message) && objectNode.get(message).has("data")) {
        String userEmailEncoded = objectNode.get(message).get("data").asText();
        logger.debug("processMessage : userEmailEncoded : " + userEmailEncoded);
        String userEmail = new String(Base64.getDecoder().decode(userEmailEncoded));
        logger.debug("processMessage : userEmailEncoded : " + userEmail);
        userCache.invalidate(userEmail);
      }
      logger.logExit("processMessage", "Success");
      return ResponseEntity.ok("Success");
    } finally {
      logger.info("Leaving processMessage ...");
    }
  }
}
