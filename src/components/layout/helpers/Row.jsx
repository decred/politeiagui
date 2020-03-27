import React from "react";
import PropTypes from "prop-types";
import { classNames } from "pi-ui";

export const Row = ({
  children,
  topMarginSize,
  justify = "left",
  noMargin,
  className,
  hide
}) =>
  !hide && (
    <div
      className={classNames(
        !noMargin && `margin-top-${topMarginSize}`,
        `justify-${justify}`,
        className
      )}
    >
      {children}
    </div>
  );

Row.propTypes = {
  children: PropTypes.node,
  topMarginSize: PropTypes.oneOf(["s", "m", "l"]),
  justify: PropTypes.oneOf(["left", "right", "space-between", "center"]),
  hide: PropTypes.bool,
  noMargin: PropTypes.bool
};

Row.defaultProps = {
  topMarginSize: "m",
  justify: "left",
  hide: false,
  noMargin: false
};

export default Row;
