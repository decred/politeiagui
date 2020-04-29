import React from "react";
import { useTheme, classNames } from "pi-ui";
import PropTypes from "prop-types";
import { useConfig } from "src/containers/Config";
import styles from "./Logo.module.css";

const Logo = ({ style, isCMS }) => {
  const { themeName } = useTheme();
  const { logoLight, logoDark } = useConfig();
  const logoSrc = themeName === "dark" ? logoDark : logoLight;
  return (
    <img
      role="presentation"
      alt="logo"
      style={style}
      className={classNames(isCMS && styles.cmsLogo)}
      src={require(`src/assets/images/${logoSrc}`)}
    />
  );
};

Logo.propTypes = {
  style: PropTypes.object,
  isCMS: PropTypes.bool
};

export default Logo;
