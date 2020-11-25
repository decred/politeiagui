import {
  Text,
  Dropdown,
  DropdownItem,
  Toggle,
  useTheme,
  classNames,
  DEFAULT_DARK_THEME_NAME,
  DEFAULT_LIGHT_THEME_NAME
} from "pi-ui";
import React, { useEffect, useMemo } from "react";
import { NavLink, withRouter } from "react-router-dom";
import useLocalStorage from "src/hooks/utils/useLocalStorage";
import useNavigation from "src/hooks/api/useNavigation";
import useModalContext from "src/hooks/utils/useModalContext";
import { useConfig } from "src/containers/Config";
import ProposalCreditsIndicator from "../ProposalCreditsIndicator";
import { ConfigFilter } from "src/containers/Config";
import ModalLogout from "src/components/ModalLogout";
import styles from "./HeaderNav.module.css";
import { isUserValidContractor } from "src/containers/DCC";

const HeaderNav = ({ history }) => {
  const { user, username } = useNavigation();
  const { navMenuPaths, enableCredits, enableAdminInvite } = useConfig();
  const { isadmin, userid } = user || {};
  const { themeName, setThemeName } = useTheme();
  const userIsAdmin = user && isadmin;

  const [handleOpenModal, handleCloseModal] = useModalContext();
  const openModalLogout = () =>
    handleOpenModal(ModalLogout, {
      onClose: handleCloseModal
    });

  const isValidContractor = isUserValidContractor(user);

  const menuItems = useMemo(
    () =>
      navMenuPaths.map(({ label, path, admin, dccRequired }, idx) => {
        if (path === "/user") {
          path += "/" + userid;
        }
        const isActive = window.location.pathname === path;
        const onMenuItemClick = (path) => () => history.push(path);
        const showItem = (admin && userIsAdmin) || !admin;
        const isDisabled = !userIsAdmin && dccRequired && !isValidContractor;
        return (
          showItem && (
            <DropdownItem
              className={classNames(
                isActive && styles.activeDropdownItem,
                isDisabled && styles.disabledDropdownItem
              )}
              key={`link-${idx}`}
              onClick={onMenuItemClick(path)}>
              {label}
            </DropdownItem>
          )
        );
      }),
    [history, navMenuPaths, userIsAdmin, userid, isValidContractor]
  );

  const [darkThemeOnLocalStorage, setDarkThemeOnLocalStorage] = useLocalStorage(
    "darkTheme",
    false
  );

  useEffect(() => {
    if (darkThemeOnLocalStorage && themeName === DEFAULT_LIGHT_THEME_NAME) {
      setThemeName(DEFAULT_DARK_THEME_NAME);
    }
  }, [darkThemeOnLocalStorage, setThemeName, themeName]);

  const onThemeToggleHandler = () => {
    if (themeName === DEFAULT_LIGHT_THEME_NAME) {
      setDarkThemeOnLocalStorage(true);
      setThemeName(DEFAULT_DARK_THEME_NAME);
    } else {
      setDarkThemeOnLocalStorage(false);
      setThemeName(DEFAULT_LIGHT_THEME_NAME);
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
        <DropdownItem onClick={onThemeToggleHandler}>
          <div className={styles.themeToggleWrapper}>
            <Toggle
              onToggle={onThemeToggleHandler}
              toggled={themeName === DEFAULT_DARK_THEME_NAME}
            />
            <div className={styles.themeToggleLabel}>Dark Mode</div>
          </div>
        </DropdownItem>
        <DropdownItem onClick={openModalLogout}>Logout</DropdownItem>
      </Dropdown>
    </div>
  ) : (
    <nav className={styles.navContainer}>
      <div
        className={classNames(styles.themeToggleWrapper, styles.publicWrapper)}>
        <Toggle
          onToggle={onThemeToggleHandler}
          toggled={themeName === DEFAULT_DARK_THEME_NAME}
        />
        <div onClick={onThemeToggleHandler} className={styles.themeToggleLabel}>
          Dark Mode
        </div>
      </div>
      {!enableAdminInvite && (
        <>
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
        </>
      )}
    </nav>
  );
};

export default withRouter(HeaderNav);
