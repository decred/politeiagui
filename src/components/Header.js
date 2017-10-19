import React from "react";
import { NavLink, Link, withRouter } from "react-router-dom";
import headerConnector from "../connectors/currentUser";

const Header = ({ loggedInAs, isAdmin, onLogout }) => (
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
      <NavLink to="/proposals/find">Find</NavLink>
      {isAdmin ? <NavLink to="/admin">Admin</NavLink> : null}
      {loggedInAs
        ? <a onClick={onLogout}>Logout</a>
        : <NavLink to="/user/login">Login</NavLink>}
    </nav>
  </header>
);

export default withRouter(headerConnector(Header));
