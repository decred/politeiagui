import PropTypes from "prop-types";
import React from "react";
import styles from "./HamburgerMenu.module.css";

const HamburgerMenu = ({ toggleShowMenu, showMenu }) => {
  return (
    <div className={styles.navButton} onClick={toggleShowMenu}>
      <span className={showMenu ? styles.navIconClose : styles.navIcon} />
    </div>
  );
};

HamburgerMenu.propTypes = {
  toggleShowMenu: PropTypes.func,
  showMenu: PropTypes.bool
};

export default HamburgerMenu;
