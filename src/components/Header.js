import React from "react";
import { Link } from "react-router-dom";

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
      <Link to="/">Home</Link>
      <Link to="/proposals/vetted">Proposals</Link>
      <Link to="/proposals/new">Submit</Link>
      <Link to="/user/login">Login</Link>
    </nav>
  </header>
);

export default Header;
