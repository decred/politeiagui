import React from "react";
import PropTypes from "prop-types";
import styles from "../layouts.module.css";
import { classNames } from "pi-ui";

export const Row = ({
  children,
  topMarginSize,
  justify,
  align,
  noMargin,
  className,
  hide,
  wrap,
  onClick
}) =>
  !hide && (
    <div
      className={classNames(
        !noMargin && `margin-top-${topMarginSize}`,
        `justify-${justify}`,
        `align-${align}`,
        wrap && styles.wrap,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );

Row.propTypes = {
  children: PropTypes.node,
  topMarginSize: PropTypes.oneOf(["s", "m", "l"]),
  justify: PropTypes.oneOf(["left", "right", "space-between", "center"]),
  align: PropTypes.oneOf(["start", "end", "center", "stretch"]),
  hide: PropTypes.bool,
  noMargin: PropTypes.bool,
  wrap: PropTypes.bool,
  onClick: PropTypes.func
};

Row.defaultProps = {
  topMarginSize: "m",
  justify: "left",
  align: "stretch",
  wrap: false,
  hide: false,
  noMargin: false
};

export default Row;
