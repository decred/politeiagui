import React from "react";
import PropTypes from "prop-types";

const TopModal = (props) =>
  <div className={`top-modal ${props.className}`} style={props.style}>
    {props.children}
  </div>;

TopModal.prototypes = {
  children: PropTypes.any,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default TopModal;
