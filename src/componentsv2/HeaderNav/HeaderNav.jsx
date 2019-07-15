import { Text, Dropdown, DropdownItem } from "pi-ui";
import React from "react";
import { NavLink, withRouter } from "react-router-dom";
import useNavigation from "src/hooks/useNavigation";
import styles from "./HeaderNav.module.css";

const HeaderNav = ({ history }) => {
  const { user, username, onLogout } = useNavigation();
  function goToUserAccount() {
    history.push(`/user/${user.userid}`);
  }
  return username ? (
    <div className={styles.loggedInContainer}>
      <Dropdown title={username}>
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
