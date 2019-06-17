/**
 * Return the user active pubkey
 *
 * @param {array} ids - Array of user identities
 * @return {string} User's active pubkey
 */
export const getUserActivePublicKey = ids =>
  ids.filter(id => id.isactive)[0].pubkey;

/**
 * Verifies if user email is verified
 *
 * @param {*} newuserverificationtoken
 * @return {string} yes/no string saying if email is verified
 */
export const isUserEmailVerified = newuserverificationtoken =>
  !newuserverificationtoken ? "Yes" : "No";

/**
 * Verifies if the user has paid the paywall
 *
 * @param {string} newuserpaywalltx
 * @return {string} yes/no string saying if paywall was paid
 */
export const hasUserPaid = newuserpaywalltx =>
  newuserpaywalltx ? "Yes" : "No";

/**
 * Verifies if the user is locked
 *
 * @param {bool} islocked
 * @return {string} yes/no string saying if the user is locked
 */
export const isUserLocked = islocked => (islocked ? "Yes" : "No");

/**
 * Verifies if the user is admin
 *
 * @param {bool} isAdmin
 * @return {string} yes/no string saying if the user is Admin
 */
export const isUserAdmin = isAdmin => (isAdmin ? "Yes" : "No");

/**
 * Verifies if the user is deactivated
 *
 * @param {bool} isDeactivated
 * @return {string} yes/no string saying if the user is deactivated
 */
export const isUserDeactivated = isDeactivated =>
  isDeactivated ? "Yes" : "No";

/**
 * Given the unix time, verifies if it is expired
 *
 * @param {number} expiryTime
 * @return {bool} true/false if timestamp is expired
 */
export const isExpired = expiryTime => new Date().getTime() > expiryTime * 1000;
