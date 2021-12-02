import { classNames, useLockBodyScrollOnTrue } from "pi-ui";
import PropTypes from "prop-types";
import React from "react";
import HeaderNav from "../HeaderNav";
import SidebarContent from "../SidebarContent";
import styles from "./NavigationDrawer.module.css";

const NavigationDrawer = ({ show, fullScreen }) => {
  useLockBodyScrollOnTrue(show);
  return (
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
  );
};

NavigationDrawer.propTypes = {
  show: PropTypes.bool.isRequired,
  fullScreen: PropTypes.bool.isRequired
};

export default NavigationDrawer;
