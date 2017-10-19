import React from "react";
import { NavLink, Link, withRouter } from "react-router-dom";
import headerConnector from "../connectors/currentUser";

const Header = ({ loggedInAs, isAdmin }) => (
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
      {isAdmin ? <NavLink to="/admin/censored">Censored</NavLink> : null}
      {isAdmin ? <NavLink to="/admin/unreviewed">Unreviewed</NavLink> : null}
      {loggedInAs
        ? <NavLink to="/user/logout">Logout</NavLink>
        : <NavLink to="/user/login">Login</NavLink>}
    </nav>
  </header>
);

export default withRouter(headerConnector(Header));
