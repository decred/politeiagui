import { Link as UILink } from "pi-ui";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

const Link = ({ to, children, ...props }) => (
  <UILink
    {...props}
    customComponent={(otherProps) => <RouterLink to={to} {...otherProps} />}>
    {children}
  </UILink>
);

export default Link;
