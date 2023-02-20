import { userAuth } from "@politeiagui/core/user/auth";

/**
 * isUserOwner checks if the user from details page is the current logged in
 * user. This is used as a condition to load routes that are only available to
 * the current logged in user.
 */
export function isUserOwner(params, getState) {
  const { userid } = params;
  const currentUser = userAuth.selectCurrent(getState());
  return currentUser && currentUser.userid === userid;
}

/**
 * isUserAdmin checks if the current logged in user is an admin. This is used as
 * a condition to load routes that are only available to admins.
 */
export function isUserAdmin(_, getState) {
  const currentUser = userAuth.selectCurrent(getState());
  return currentUser && currentUser.isadmin;
}

/**
 * navigateToDetails redirects the user to the user details page. This is used
 * as a fallback when a route is not available to the current logged in user.
 */
export function navigateToDetails({ userid }, navigateTo) {
  return navigateTo(`/user/${userid}`);
}
