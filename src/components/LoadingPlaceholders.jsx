import React from "react";
import PropTypes from "prop-types";

const LoadingPlaceholders = ({ numberOfItems, placeholder }) => {
  const Item = placeholder;
  const placeholders = [];
  for (let i = 0; i < numberOfItems; i++) {
    placeholders.push(
      <Item key={`placeholder-${i}`} data-testid="loading-placeholder" />
    );
  }
  return <>{placeholders}</>;
};

LoadingPlaceholders.propTypes = {
  numberOfItems: PropTypes.number,
  placeholder: PropTypes.oneOfType([PropTypes.func, PropTypes.node])
};

export default LoadingPlaceholders;
