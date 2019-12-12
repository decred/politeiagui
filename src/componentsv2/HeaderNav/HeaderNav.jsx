import { Text, Dropdown, DropdownItem, Toggle, useTheme } from "pi-ui";
import React, { useEffect } from "react";
import { NavLink, withRouter } from "react-router-dom";
import useLocalStorage from "src/hooks/utils/useLocalStorage";
import ProposalCreditsIndicator from "../ProposalCreditsIndicator";
import useNavigation from "src/hooks/api/useNavigation";
import styles from "./HeaderNav.module.css";

const HeaderNav = ({ history, location }) => {
  const { user, username, onLogout } = useNavigation();
  const { themeName, setThemeName } = useTheme();
  function goToUserAccount() {
    history.push(`/user/${user.userid}`);
  }
  function goToUnvetted() {
    history.push("/proposals/unvetted");
  }
  function goToPublicProposals() {
    history.push("/");
  }
  function goToSearchUsers() {
    history.push("/user/search");
  }
  const isOnUnvettedRoute = location.pathname === "/proposals/unvetted";
  const isOnSearchUsersRoute = location.pathname === "/user/search";
  const [
    darkThemeOnLocalStorage,
    setDarkThemeOnLocalStorage
  ] = useLocalStorage("darkTheme", false);

  useEffect(() => {
    if (darkThemeOnLocalStorage && themeName === "light") {
      setThemeName("dark");
    }
  }, [darkThemeOnLocalStorage, setThemeName, themeName]);

  const onThemeToggleHandler = () => {
    if (themeName === "light") {
      setDarkThemeOnLocalStorage(true);
      setThemeName("dark");
    } else {
      setThemeName("light");
      setDarkThemeOnLocalStorage(false);
    }
  };
  return user && username ? (
    <div className={styles.loggedInContainer}>
      <ProposalCreditsIndicator user={user} />
      <Dropdown
        className={styles.dropdown}
        itemsListClassName={styles.dropdownList}
        closeOnItemClick={false}
        title={username}
      >
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
        <DropdownItem>
          <div className={styles.themeToggleWrapper}>
            <Toggle onToggle={onThemeToggleHandler} toggled={themeName === "dark"} />
            <div onClick={onThemeToggleHandler} className={styles.themeToggleLabel}>Night Mode</div>
          </div>
        </DropdownItem>
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
