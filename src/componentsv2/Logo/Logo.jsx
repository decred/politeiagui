import React from "react";
import { useTheme } from "pi-ui";
import PropTypes from "prop-types";
import { useConfig } from "src/containers/Config";

const Logo = ({ style }) => {
  const { themeName } = useTheme();
  const { logoLight, logoDark } = useConfig();
  const logoSrc = themeName === "dark" ? logoDark : logoLight;
  return (
    <img
      role="presentation"
      alt="logo"
      style={style}
      src={require(`src/assets/images/${logoSrc}`)}
    />
  );
};

Logo.propTypes = {
  style: PropTypes.object
};

export default Logo;
