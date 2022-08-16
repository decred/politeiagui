import React from "react";
import { router } from "@politeiagui/core/router";
import { Navbar, ThemeToggle, theme } from "@politeiagui/common-ui/layout";
import { useSelector } from "react-redux";
import { DEFAULT_DARK_THEME_NAME, Text } from "pi-ui";
import LogoLight from "../../public/assets/images/pi-logo-light.svg";
import LogoDark from "../../public/assets/images/pi-logo-dark.svg";
import About from "../Static/About";
import styles from "./styles.module.css";

function PoliteiaLogo() {
  const themeName = useSelector(theme.select);
  return (
    <div
      onClick={() => router.navigateTo("/")}
      className={styles.logo}
      data-testid="politeia-logo"
    >
      <Text>
        {themeName === DEFAULT_DARK_THEME_NAME ? <LogoDark /> : <LogoLight />}
      </Text>
    </div>
  );
}

function Header() {
  return (
    <Navbar logo={<PoliteiaLogo />} drawerContent={<About />}>
      <ThemeToggle />
      <a href="/user/login">Log in</a>
      <a href="/user/signup">Sign up</a>
    </Navbar>
  );
}

export default Header;
