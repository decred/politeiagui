import React from "react";
import PropTypes from "prop-types";
import { classNames, Icon } from "pi-ui";
import styles from "./IconButton.module.css";

const IconButton = ({ onClick, className, iconClassName, ...props }) => {
  return (
    <button
      onClick={onClick}
      className={classNames(styles.iconButton, className)}
    >
      <Icon {...props} />
    </button>
  );
};

IconButton.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  iconClassName: PropTypes.string
};

export default IconButton;
