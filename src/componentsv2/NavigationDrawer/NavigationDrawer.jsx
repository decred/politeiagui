import { classNames } from "pi-ui";
import React from "react";
import HeaderNav from "../HeaderNav";
import SidebarContent from "../SidebarContent";
import styles from "./NavigationDrawer.module.css";

const NavigationDrawer = ({ show, fullScreen }) => {
  return (
    <div className={classNames(
      fullScreen ?
        styles.navigationDrawerFullScreen :
        styles.navigationDrawer,
      show && styles.navigationDrawerShow
    )
    }>
      <div className={classNames(styles.navWrapper, "margin-bottom-s")}>
        <HeaderNav />
      </div>
      <SidebarContent />
      <div className={styles.fillHeight} />
    </div>
  );
};

// NavigationDrawer.propTypes = {

// };

export default NavigationDrawer;
