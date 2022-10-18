import React from "react";
import PropTypes from "prop-types";
import { classNames } from "pi-ui";
import styles from "./styles.module.css";

const DefaultSeparator = () => <span className={styles.separator}>•</span>;

export const Join = ({ children, SeparatorComponent, className, inline }) => {
  const childrenArray = React.Children.toArray(children).filter((c) => !!c);
  return (
    <div
      className={classNames(styles.join, inline && styles.inline, className)}
    >
      {childrenArray.map((child, idx) => (
        <React.Fragment key={`join-${idx}`}>
          {React.cloneElement(child)}
          {childrenArray[idx + 1] ? <SeparatorComponent /> : ""}
        </React.Fragment>
      ))}
    </div>
  );
};

Join.propType = {
  children: PropTypes.node,
  SeparatorComponent: PropTypes.node,
};

Join.defaultProps = {
  SeparatorComponent: DefaultSeparator,
};

export default Join;
