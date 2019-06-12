import React from "react";
import PropTypes from "prop-types";
import { classNames } from "pi-ui";
import styles from "./Join.module.css";

const DefaultSeparator = () => (
  <span className="margin-left-s margin-right-s">•</span>
);

export const Join = ({ children, SeparatorComponent, className }) => {
  const childrenArray = React.Children.toArray(children).filter(c => !!c);
  return (
    <div className={classNames(styles.join, className)}>
      {childrenArray.map((child, idx) => (
        <>
          {React.cloneElement(child)}
          {childrenArray[idx + 1] ? <SeparatorComponent /> : ""}
        </>
      ))}
    </div>
  );
};

Join.propType = {
  children: PropTypes.node,
  SeparatorComponent: PropTypes.node
};

Join.defaultProps = {
  SeparatorComponent: DefaultSeparator
};

export default Join;
