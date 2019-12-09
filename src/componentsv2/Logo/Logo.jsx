import React from "react";
import PropTypes from "prop-types";
import { useConfig } from "src/containers/Config";

const Logo = ({ style }) => {
  const { logoLight } = useConfig();
  return (
    <img
      role="presentation"
      alt="logo"
      style={style}
      src={require(`src/assets/images/${logoLight}`)}
    />
  );
};

Logo.propTypes = {
  style: PropTypes.object
};

export default Logo;
