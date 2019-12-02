import { Text, Dropdown, DropdownItem } from "pi-ui";
import Link from "src/componentsv2/Link";
import React, { useMemo } from "react";
import { NavLink, withRouter } from "react-router-dom";
import ProposalCreditsIndicator from "../ProposalCreditsIndicator";
import useNavigation from "src/hooks/api/useNavigation";
import { useConfig } from "src/containers/Config";
import styles from "./HeaderNav.module.css";
import { ConfigFilter } from "src/containers/Config";

const HeaderNav = ({ history }) => {
  const { user, username, onLogout } = useNavigation();
  const { navMenuPaths } = useConfig();

  const userIsAdmin = user && user.isadmin;

  const menuItems = useMemo(
    () =>
      navMenuPaths.map(({ label, path, admin }, idx) => {
        return (
          ((admin && userIsAdmin) || !admin) && (
            <DropdownItem key={`link-${idx}`}>
              <Link className={styles.navLink} to={path}>
                {label}
              </Link>
            </DropdownItem>
          )
        );
      }),
    [userIsAdmin, navMenuPaths]
  );

  function goToUserAccount() {
    history.push(`/user/${user.userid}`);
  }

  return user && username ? (
    <div className={styles.loggedInContainer}>
      <ConfigFilter showIf={config => config.enableCredits}>
        <ProposalCreditsIndicator user={user} />
      </ConfigFilter>
      <Dropdown
        className={styles.dropdown}
        itemsListClassName={styles.dropdownList}
        title={username}
      >
        {menuItems}
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
