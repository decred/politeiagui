import { Text } from "pi-ui";
import React from "react";
import { NavLink } from "react-router-dom";
import useNavigation from "src/hooks/useNavigation";
import styles from "./HeaderNav.module.css";

const HeaderNav = () => {
  const { user, username, onLogout } = useNavigation();
  return (
    username ? (
      <div>
        <NavLink to={`/user/${user.userid}`} style={{ marginRight: "10px" }}>
          {username}
        </NavLink>
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
      )
  );
};

HeaderNav.propTypes = {
  // username: PropTypes.string,
  // user: PropTypes.object,
  // onLogout: PropTypes.func
};

export default HeaderNav;
