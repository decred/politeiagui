import React from "react";
import PropTypes from "prop-types";
import Message from "../Message";

const HeaderAlert = (props) =>
  <div className={`top-modal ${props.className}`} style={props.style}>
    <Message
      type="error"
      header="Action Needed"
      body={props.children}
    />
  </div>;

HeaderAlert.prototypes = {
  children: PropTypes.any,
  style: PropTypes.object,
  className: PropTypes.string,
};

export default HeaderAlert;
