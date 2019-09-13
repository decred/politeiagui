import { Text, Dropdown, DropdownItem } from "pi-ui";
import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import ProposalCreditsIndicator from "../ProposalCreditsIndicator";
import useNavigation from "src/hooks/api/useNavigation";
import styles from "./HeaderNav.module.css";

const HeaderNav = ({ history, location }) => {
  const { user, username, onLogout } = useNavigation();
  function goToUserAccount() {
    history.push(`/user/${user.userid}`);
  }
  function goToUnvetted() {
    history.push(`/proposals/unvetted`);
  }
  function goToPublicProposals() {
    history.push("/");
  }
  function goToSearchUsers() {
    history.push("/user/search");
  }
  const isOnUnvettedRoute = location.pathname === "/proposals/unvetted";
  const isOnSearchUsersRoute = location.pathname === "/user/search";
  return username ? (
    <div className={styles.loggedInContainer}>
      <ProposalCreditsIndicator />
      <Dropdown itemsListClassName={styles.dropdownList} title={username}>
        {user.isadmin && !isOnUnvettedRoute && (
          <DropdownItem onClick={goToUnvetted}>Admin</DropdownItem>
        )}
        {isOnUnvettedRoute && (
          <DropdownItem onClick={goToPublicProposals}>Proposals</DropdownItem>
        )}
        {user.isadmin && !isOnSearchUsersRoute && (
          <DropdownItem onClick={goToSearchUsers}>
            Search for users
          </DropdownItem>
        )}
        <DropdownItem onClick={goToUserAccount}>Account</DropdownItem>
        <DropdownItem onClick={onLogout}>Logout</DropdownItem>
      </Dropdown>
    </div>
  ) : (
    <nav className={styles.navContainer}>
      <NavLink
        className={styles.navLink}
        activeClassName={styles.activeNavLink}
        to="/user/login"
      >
        <Text className={`${styles.navLinkText} ${styles.rightGreyBorder}`}>
          Log in
        </Text>
      </NavLink>
      <NavLink
        className={styles.navLink}
        activeClassName={styles.activeNavLink}
        to="/user/signup"
      >
        <Text className={styles.navLinkText}>Sign up</Text>
      </NavLink>
    </nav>
  );
};

export default withRouter(HeaderNav);
