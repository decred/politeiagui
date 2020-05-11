import {
  Text,
  Dropdown,
  DropdownItem,
  Toggle,
  useTheme,
  classNames
} from "pi-ui";
import React, { useEffect, useMemo, useCallback } from "react";
import Link from "src/components/Link";
import { NavLink, withRouter } from "react-router-dom";
import useLocalStorage from "src/hooks/utils/useLocalStorage";
import useNavigation from "src/hooks/api/useNavigation";
import useModalContext from "src/hooks/utils/useModalContext";
import { useConfig } from "src/containers/Config";
import ProposalCreditsIndicator from "../ProposalCreditsIndicator";
import { ConfigFilter } from "src/containers/Config";
import ModalLogout from "src/components/ModalLogout";
import styles from "./HeaderNav.module.css";

const HeaderNav = ({ history }) => {
  const { user, username } = useNavigation();
  const { navMenuPaths, enableCredits } = useConfig();
  const { isadmin, userid } = user || {};
  const { themeName, setThemeName } = useTheme();
  const userIsAdmin = user && isadmin;

  const [handleOpenModal, handleCloseModal] = useModalContext();
  const openModalLogout = () =>
    handleOpenModal(ModalLogout, {
      onClose: handleCloseModal
    });

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

  const [darkThemeOnLocalStorage, setDarkThemeOnLocalStorage] = useLocalStorage(
    "darkTheme",
    false
  );

  const goToUserAccount = useCallback(() => {
    history.push(`/user/${userid}`);
  }, [history, userid]);

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
    <div
      className={classNames(
        styles.loggedInContainer,
        !enableCredits && styles.noCreditsContainer
      )}>
      <ConfigFilter showIf={(config) => config.enableCredits}>
        <ProposalCreditsIndicator user={user} />
      </ConfigFilter>
      <Dropdown
        className={classNames(
          styles.dropdown,
          !enableCredits && styles.noCreditsDropdown
        )}
        itemsListClassName={styles.dropdownList}
        closeOnItemClick={false}
        title={username}>
        {menuItems}
        <DropdownItem onClick={goToUserAccount}>Account</DropdownItem>
        <DropdownItem>
          <div className={styles.themeToggleWrapper}>
            <Toggle
              onToggle={onThemeToggleHandler}
              toggled={themeName === "dark"}
            />
            <div
              onClick={onThemeToggleHandler}
              className={styles.themeToggleLabel}>
              Dark Mode
            </div>
          </div>
        </DropdownItem>
        <DropdownItem onClick={openModalLogout}>Logout</DropdownItem>
      </Dropdown>
    </div>
  ) : (
    <nav className={styles.navContainer}>
      <NavLink
        className={styles.navLink}
        activeClassName={styles.activeNavLink}
        to="/user/login">
        <Text className={`${styles.navLinkText} ${styles.rightGreyBorder}`}>
          Log in
        </Text>
      </NavLink>
      <NavLink
        className={styles.navLink}
        activeClassName={styles.activeNavLink}
        to="/user/signup">
        <Text className={styles.navLinkText}>Sign up</Text>
      </NavLink>
    </nav>
  );
};

export default withRouter(HeaderNav);
