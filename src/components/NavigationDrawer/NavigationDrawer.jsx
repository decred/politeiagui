import { classNames, useLockBodyScrollOnTrue } from "pi-ui";
import PropTypes from "prop-types";
import React from "react";
import HeaderNav from "../HeaderNav";
import SidebarContent from "../SidebarContent";
import styles from "./NavigationDrawer.module.css";
import HamburgerMenu from "src/components/HamburgerMenu";

const NavigationDrawer = ({ show, fullScreen, toggleShowMenu }) => {
  useLockBodyScrollOnTrue(show);
  return (
    <>
      {/* this div is used when tabIng makes the page scroll down so the user can close the Navigation Drawer */}
      {show && (
        <div className={styles.navigationDrawerHeader}>
          <HamburgerMenu toggleShowMenu={toggleShowMenu} showMenu={show} />
        </div>
      )}
      <div
        className={classNames(
          fullScreen
            ? styles.navigationDrawerFullScreen
            : styles.navigationDrawer,
          show && styles.navigationDrawerShow
        )}>
        <div className={classNames(styles.navWrapper, "margin-bottom-s")}>
          <HeaderNav />
        </div>
        <SidebarContent />
      </div>
    </>
  );
};

NavigationDrawer.propTypes = {
  show: PropTypes.bool.isRequired,
  fullScreen: PropTypes.bool.isRequired
};

export default NavigationDrawer;
