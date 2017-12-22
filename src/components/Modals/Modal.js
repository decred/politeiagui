import React from "react";
import { createElement as h } from "react";

const Modal = ({ children, className, isHidden }) => (
  <div>
    <div className="app-modal-overlay" hidden={isHidden}></div>
    <div className={"app-modal " + (className || "")}>
      {h(children, {isHidden})}
    </div>
  </div>
);

export default Modal;
