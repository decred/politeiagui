import React from "react";
import PropTypes from "prop-types";
import { Spinner } from "pi-ui";
import styles from "./LoadingWithMessage.module.css";

const LoadingWithMessage = ({ message, spinnerProps, ...props }) => (
  <div className={styles.wrapper} {...props}>
    <Spinner {...spinnerProps} />
    <span className={styles.text}>{message}</span>
  </div>
);

LoadingWithMessage.propTypes = {
  message: PropTypes.string.isRequired,
  spinnerProps: PropTypes.object
};

export default LoadingWithMessage;
