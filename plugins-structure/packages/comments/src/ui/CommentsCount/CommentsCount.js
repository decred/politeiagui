import React from "react";
import PropTypes from "prop-types";
import { Icon } from "pi-ui";
import styles from "./styles.module.css";

const Wrapper = ({ link, children, className }) =>
  link ? (
    <a data-link href={link} className={className}>
      {children}
    </a>
  ) : (
    <div className={className}>{children}</div>
  );

export const CommentsCount = ({ link, count }) => {
  return (
    <Wrapper link={link} className={styles.countWrapper}>
      <Icon type="discuss" />
      <span className={styles.count}>{count}</span>
      Comments
    </Wrapper>
  );
};

CommentsCount.propTypes = {
  link: PropTypes.string,
};
