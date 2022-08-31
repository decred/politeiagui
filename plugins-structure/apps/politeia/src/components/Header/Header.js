import React from "react";
import { useSelector } from "react-redux";
import { DEFAULT_DARK_THEME_NAME } from "pi-ui";
import { Navbar, ThemeToggle, theme } from "@politeiagui/common-ui/layout";
import LogoLight from "../../public/assets/images/pi-logo-light.svg";
import LogoDark from "../../public/assets/images/pi-logo-dark.svg";
import About from "../Static/About";

function PoliteiaLogo() {
  const themeName = useSelector(theme.select);
  return (
    <a data-link href="/" data-testid="politeia-logo">
      {themeName === DEFAULT_DARK_THEME_NAME ? <LogoDark /> : <LogoLight />}
    </a>
  );
}

function Header() {
  return (
    <Navbar logo={<PoliteiaLogo />} drawerContent={<About />}>
      <ThemeToggle />
      <a href="/user/login" data-link>
        Log in
      </a>
      <a href="/user/signup" data-link>
        Sign up
      </a>
    </Navbar>
  );
}

export default Header;
