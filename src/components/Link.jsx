import { Link as UILink } from "pi-ui";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

// TODO: remove legacy
const Link = ({ to, children, isLegacy, ...props }) => (
  <UILink
    {...props}
    customComponent={
      isLegacy
        ? (otherProps) => (
            <a href={to} {...otherProps}>
              {children}
            </a>
          )
        : (otherProps) => <RouterLink to={to} {...otherProps} />
    }
  >
    {children}
  </UILink>
);

export default Link;
