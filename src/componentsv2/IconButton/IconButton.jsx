import React from "react";
import PropTypes from "prop-types";
import { classNames, Icon } from "pi-ui";
import styles from "./IconButton.module.css";

const IconButton = React.forwardRef(
  ({ onClick, className, iconClassName, ...props }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={classNames(styles.iconButton, className)}
      >
        <Icon {...props} />
      </button>
    );
  }
);

IconButton.propTypes = {
  onClick: PropTypes.func,
  className: PropTypes.string,
  iconClassName: PropTypes.string
};

export default IconButton;
