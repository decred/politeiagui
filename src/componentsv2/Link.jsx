import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link as UILink } from "pi-ui";

const Link = ({ to, children, ...props }) => (
  <UILink
    {...props}
    customComponent={otherProps => <RouterLink to={to} {...otherProps} />}
  >
    {children}
  </UILink>
);

export default Link;
