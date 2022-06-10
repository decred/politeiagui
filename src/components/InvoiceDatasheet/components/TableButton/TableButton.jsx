import React from "react";
import { Link, classNames } from "pi-ui";
import styles from "./TableButton.module.css";

const TableButton = ({ onClick, disabled, children }) => {
  return (
    <Link
      customComponent={(props) => (
        <span
          {...props}
          className={classNames(
            props.className,
            styles.tableButton,
            disabled && styles.tableButtonDisabled
          )}
          onClick={!disabled ? onClick : () => null}
        >
          {children}
        </span>
      )}
    />
  );
};

export default TableButton;
