import React from "react";
import { NavLink } from "react-router-dom";
import { Header as UIHeader, Text } from "pi-ui";
import styles from "./Header.module.css";
import Logo from "src/assets/pi-logo-light.svg";
import { useHeader } from "./hooks";

const Header = ({ noBorder }) => {
  const { username, onLogout } = useHeader();
  return (
    <UIHeader
      className={`${styles.customHeader} ${noBorder ? styles.noBorder : ""}`}
    >
      <NavLink to="/">
        <img src={Logo} alt="presentation" />
      </NavLink>
      {username ? (
        <div>
          <Text className="margin-right-s">{username}</Text>
          <Text onClick={onLogout}>Logout</Text>
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
      )}
    </UIHeader>
  );
};

export default Header;
