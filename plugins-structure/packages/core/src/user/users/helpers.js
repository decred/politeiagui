/**
 * Valid actions are:
 * 1. expirenewuser           Expires new user verification
 * 2. expireupdatekey         Expires update user key verification
 * 3. expireresetpassword     Expires reset password verification
 * 4. clearpaywall            Clears user registration paywall
 * 5. unlocks                 Unlocks user account from failed logins
 * 6. deactivate             Deactivates user account
 * 7. reactivate              Reactivates user account
 */

export const USER_MANAGE_ACTION_EXPIRE_USER = 1;
export const USER_MANAGE_ACTION_EXPIRE_UPDATE_KEY = 2;
export const USER_MANAGE_ACTION_EXPIRE_RESET_PASSWORD = 3;
export const USER_MANAGE_ACTION_CLEAR_PAYWALL = 4;
export const USER_MANAGE_ACTION_UNLOCK = 5;
export const USER_MANAGE_ACTION_DEACTIVATE = 6;
export const USER_MANAGE_ACTION_REACTIVATE = 7;

/**
 * userManageActionToCode - converts user manage action to code number.
 *
 * @param {string} action - user manage action
 * @returns {number} - user manage action code
 */
export function userManageActionToCode(action) {
  switch (action) {
    case "expirenewuser":
      return USER_MANAGE_ACTION_EXPIRE_USER;
    case "expireupdatekey":
      return USER_MANAGE_ACTION_EXPIRE_UPDATE_KEY;
    case "expireresetpassword":
      return USER_MANAGE_ACTION_EXPIRE_RESET_PASSWORD;
    case "clearpaywall":
      return USER_MANAGE_ACTION_CLEAR_PAYWALL;
    case "unlocks":
      return USER_MANAGE_ACTION_UNLOCK;
    case "deactivate":
      return USER_MANAGE_ACTION_DEACTIVATE;
    case "reactivate":
      return USER_MANAGE_ACTION_REACTIVATE;
    default:
      return null;
  }
}
