import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link as UILink } from "pi-ui";

const Link = ({ to, children, className }) => (
  <RouterLink to={to}>
    <UILink className={className}>{children}</UILink>
  </RouterLink>
);

export default Link;
