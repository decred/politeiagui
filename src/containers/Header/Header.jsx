import { classNames, Header as UIHeader, useMediaQuery } from "pi-ui";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "src/assets/pi-logo-light.svg";
import HamburgerMenu from "src/componentsv2/HamburgerMenu";
import HeaderNav from "src/componentsv2/HeaderNav";
import NavigationDrawer from "src/componentsv2/NavigationDrawer";
import styles from "./Header.module.css";

const Header = ({ noBorder }) => {
  const small = useMediaQuery("(max-width: 1000px)");
  const extrasmall = useMediaQuery("(max-width: 560px)");
  const [showMenu, setShowMenu] = useState(false);
  const toggleShowMenu = () => setShowMenu(!showMenu);
  return (
    <UIHeader className={classNames(noBorder && styles.noBorder)}>
      <NavLink
        to="/"
        className={extrasmall && showMenu ? styles.hideLogo : styles.showLogo}
      >
        <img src={Logo} alt="presentation" />
      </NavLink>
      {small ? (
        <>
          <HamburgerMenu toggleShowMenu={toggleShowMenu} showMenu={showMenu} />
          <NavigationDrawer show={showMenu} fullScreen={extrasmall} />
        </>
      ) : (
        <HeaderNav />
      )}
    </UIHeader>
  );
};

export default Header;
