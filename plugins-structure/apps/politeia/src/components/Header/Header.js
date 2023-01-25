import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { DEFAULT_DARK_THEME_NAME, Dropdown, DropdownItem } from "pi-ui";
import { Navbar, ThemeToggle, theme } from "@politeiagui/common-ui/layout";
import LogoLight from "../../public/assets/images/pi-logo-light.svg";
import LogoDark from "../../public/assets/images/pi-logo-dark.svg";
import About from "../Static/About";
import { user } from "@politeiagui/core/user";
import styles from "./styles.module.css";

function PoliteiaLogo() {
  const themeName = useSelector(theme.select);
  return (
    <a data-link href="/" data-testid="politeia-logo">
      {themeName === DEFAULT_DARK_THEME_NAME ? <LogoDark /> : <LogoLight />}
    </a>
  );
}

function Item({ href, name, onClick }) {
  return href ? (
    <a href={href} data-link>
      <DropdownItem>{name}</DropdownItem>
    </a>
  ) : (
    <div>
      <DropdownItem onClick={onClick}>{name}</DropdownItem>
    </div>
  );
}

function HeaderItems() {
  const dispatch = useDispatch();
  const currentUser = useSelector(user.selectCurrent);
  function handleLogout() {
    // TODO: Display logout modal
    dispatch(user.logout());
  }
  return currentUser ? (
    <div>
      <Dropdown
        title={currentUser.username}
        itemsListClassName={styles.headerItems}
      >
        <Item name="Account" href={`/user/${currentUser.userid}`} />
        <Item name="All Proposals" href="/" />
        <Item
          href={`/user/${currentUser.userid}/proposals`}
          name="My Proposals"
        />
        <Item href={`/user/${currentUser.userid}/drafts`} name="My Drafts" />
        {/* TODO: only show this for admin */}
        <Item href="/admin/records" name="Admin" />
        <Item href="/admin/search" name="Search for Users" />
        {/* END TODO */}
        <Item name="Logout" onClick={handleLogout} />
      </Dropdown>
    </div>
  ) : (
    <>
      <a href="/user/login" data-link>
        Log in
      </a>
      <a href="/user/signup" data-link>
        Sign up
      </a>
    </>
  );
}

function Header() {
  return (
    <Navbar logo={<PoliteiaLogo />} drawerContent={<About />}>
      <ThemeToggle />
      <HeaderItems />
    </Navbar>
  );
}

export default Header;
