import React from "react";
import PropTypes from "prop-types";

export const Or = ({ children }) => {
  const firstTruthyChild = React.Children.toArray(children).filter(
    (c) => !!c
  )[0];
  return firstTruthyChild || null;
};

Or.propType = {
  children: PropTypes.node
};

export default Or;
