import React from "react";
import {
  Navbar,
  ThemeToggle,
  UiTheme,
  theme,
} from "@politeiagui/common-ui/layout";
import { useSelector } from "react-redux";
import { DEFAULT_DARK_THEME_NAME, Text } from "pi-ui";
import LogoLight from "../../public/assets/images/pi-logo-light.svg";
import LogoDark from "../../public/assets/images/pi-logo-dark.svg";
import About from "../Static/About";

function PoliteiaLogo() {
  const themeName = useSelector(theme.select);
  return (
    <Text>
      {themeName === DEFAULT_DARK_THEME_NAME ? <LogoDark /> : <LogoLight />}
    </Text>
  );
}

function Header() {
  return (
    <UiTheme>
      <Navbar logo={<PoliteiaLogo />} drawerContent={<About />}>
        <ThemeToggle />
        <a href="/user/login">Log in</a>
        <a href="/user/signup">Sign up</a>
      </Navbar>
    </UiTheme>
  );
}

export default Header;
