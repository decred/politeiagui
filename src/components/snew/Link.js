import React from "react";
import { NavLink } from "react-router-dom";

const Link = ({ href, ...props }) => {
  props = Object.keys(props)
    .filter(key => key[0] === key[0].toLowerCase())
    .reduce((r, key) => {
      r[key] = props[key];
      return r;
    }, {});
  return <NavLink to={href} {...props} />;
};

export default Link;
