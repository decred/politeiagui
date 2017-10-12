import React from "react";
import { NavLink, Link } from "react-router-dom";

const Header = () => (
  <header className="header">
    <h1>
      <Link to="/">
        <img
          alt="decred"
          src="https://www.decred.org/content/images/logo.svg"
          height={32}
        />
      </Link>
    </h1>
    <nav>
      <NavLink to="/about">About</NavLink>
      <NavLink to="/proposals/new">Submit</NavLink>
      <NavLink to="/user/login">Login</NavLink>
    </nav>
  </header>
);

export default Header;
