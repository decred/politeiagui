import { classNames, Header as UIHeader, useMediaQuery } from "pi-ui";
import React, { useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import Logo from "src/components/Logo";
import HamburgerMenu from "src/components/HamburgerMenu";
import HeaderNav from "src/components/HeaderNav";
import NavigationDrawer from "src/components/NavigationDrawer";
import { useConfig } from "src/containers/Config";
import { NOJS_ROUTE_PREFIX } from "src/constants";
import styles from "./Header.module.css";

const Header = ({ noBorder }) => {
  const small = useMediaQuery("(max-width: 1000px)");
  const extrasmall = useMediaQuery("(max-width: 560px)");
  const [showMenu, setShowMenu] = useState(false);
  const { javascriptEnabled } = useConfig();
  const url = javascriptEnabled ? "/" : NOJS_ROUTE_PREFIX + "/";
  const toggleShowMenu = useCallback(
    () => setShowMenu(!showMenu),
    [showMenu, setShowMenu]
  );
  return (
    <UIHeader className={classNames(noBorder && styles.noBorder)}>
      <NavLink
        to={url}
        className={extrasmall && showMenu ? styles.hideLogo : styles.showLogo}
      >
        <Logo />
      </NavLink>
      {small ? (
        <>
          <HamburgerMenu toggleShowMenu={toggleShowMenu} showMenu={showMenu} />
          <NavigationDrawer
            show={showMenu}
            fullScreen={extrasmall}
            toggleShowMenu={toggleShowMenu}
          />
        </>
      ) : (
        <HeaderNav />
      )}
    </UIHeader>
  );
};

export default Header;
