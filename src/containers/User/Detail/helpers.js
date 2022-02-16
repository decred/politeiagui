export const tabValues = {
  IDENTITY: "Identity",
  ACCOUNT: "Account",
  PREFERENCES: "Preferences",
  CREDITS: "Credits",
  SUBMITTED_PROPOSALS: "Submitted Proposals",
  DRAFT_PROPOSALS: "Draft Proposals",
  INVOICES: "Invoices",
  DRAFTS: "Drafts",
  MANAGE_DCC: "Manage Contractor",
  PROPOSALS_OWNED: "Proposals Owned",
  TOTP: "Two-Factor Authentication"
};

/**
 * Return the user active pubkey
 *
 * @param {array} ids - Array of user identities
 * @return {string} User's active pubkey
 */
export const getUserActivePublicKey = (ids) =>
  ids.filter((id) => id.isactive)[0].pubkey;

/**
 * Verifies if user email is verified
 *
 * @param {*} newuserverificationtoken
 * @return {string} yes/no string saying if email is verified
 */
export const isUserEmailVerified = (newuserverificationtoken) =>
  !newuserverificationtoken;

/**
 * Verifies if the user has paid the paywall
 *
 * @param {string} newuserpaywalltx
 * @return {string} yes/no string saying if paywall was paid
 */
export const hasUserPaid = (
  newuserpaywalltx,
  newuserpaywallamount,
  fromPaywall
) => fromPaywall || newuserpaywalltx || newuserpaywallamount === 0;

/**
 * Verifies if the user is locked
 *
 * @param {bool} islocked
 * @return {string} yes/no string saying if the user is locked
 */
export const isUserLocked = (islocked) => islocked;

/**
 * Verifies if the user is admin
 *
 * @param {bool} isAdmin
 * @return {string} yes/no string saying if the user is Admin
 */
export const isUserAdmin = (isAdmin) => isAdmin;

/**
 * Verifies if the user is deactivated
 *
 * @param {bool} isDeactivated
 * @return {string} yes/no string saying if the user is deactivated
 */
export const isUserDeactivated = (isDeactivated) => isDeactivated;

/**
 * Given the unix time, verifies if it is expired
 *
 * @param {number} expiryTime
 * @return {bool} true/false if timestamp is expired
 */
export const isExpired = (expiryTime) =>
  new Date().getTime() > expiryTime * 1000;
