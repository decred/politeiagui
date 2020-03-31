import React from "react";
import PropTypes from "prop-types";
import { classNames } from "pi-ui";

export const Row = ({
  children,
  topMarginSize,
  justify,
  align,
  noMargin,
  className,
  hide,
  onClick
}) =>
  !hide && (
    <div
      className={classNames(
        !noMargin && `margin-top-${topMarginSize}`,
        `justify-${justify}`,
        `align-${align}`,
        className
      )}
      onClick={onClick}>
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
  onClick: PropTypes.func
};

Row.defaultProps = {
  topMarginSize: "m",
  justify: "left",
  align: "stretch",
  hide: false,
  noMargin: false
};

export default Row;
