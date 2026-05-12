package com.bmtest.finalgithub.base.service;

import com.bmtest.finalgithub.base.model.ApplicationUserBase;
import com.rappit.rd.base.authentication.IAppUserPrivilegeService;
import com.rappit.rd.base.mail.model.EmailAddress;
import com.rappit.rd.base.model.wrapper.UserPrivilegePerimeter;
import java.util.List;
import java.util.Map;

/**
 * Service interface for ApplicationUser entity. Defines business operations for user management,
 * authentication, and role-based access.
 *
 * @param <M> the model type extending ApplicationUserBase
 */
public interface IApplicationUserBaseService<M extends ApplicationUserBase>
    extends IAppUserPrivilegeService<M> {
  public M getBysiduniqueIndex(String sid);

  public M getByemailprimaryIndex(String email);

  /**
   * Retrieves users by role with perimeter filtering and pagination.
   *
   * @param rolePerimeterInfo the role and perimeter information
   * @param page the page number
   * @param pageSize the page size
   * @return list of email addresses for users matching the criteria
   */
  public List<EmailAddress> getUsersByRole(
      UserPrivilegePerimeter rolePerimeterInfo, Integer page, Integer pageSize);

  /**
   * Retrieves all available roles as a map.
   *
   * @return map of role names to their display values
   */
  public Map<String, String> getAllRolesMap();

  /**
   * Updates the language preference for the current user.
   *
   * @param userLanguage map containing the language code
   * @return true if update was successful, false otherwise
   */
  public boolean updateUserLang(Map<String, String> userLanguage);

  /**
   * Updates the name for the current user.
   *
   * @param requestBody map containing firstName and lastName
   * @return true if update was successful, false otherwise
   */
  public boolean updateName(Map<String, String> requestBody);

  /**
   * Creates or updates an application user based on email existence.
   *
   * @param model the application user model
   * @return the created or updated application user
   */
  public M createOrUpdateAppUser(M model);
}
