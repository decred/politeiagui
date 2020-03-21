import React from "react";
import PropTypes from "prop-types";
import styles from "./Files.module.css";

const ThumbnailGridErrors = ({ errors }) => {
  const fileErrors = errors.files || [];
  const uniqueErrors = Array.isArray(fileErrors)
    ? [...new Set(fileErrors)]
    : [fileErrors];
  return uniqueErrors.map(
    (err) =>
      err && (
        <p key={err} className={styles.fileErrorText}>
          {err}
        </p>
      )
  );
};

ThumbnailGridErrors.propTypes = {
  errors: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export default ThumbnailGridErrors;
