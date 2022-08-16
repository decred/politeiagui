import React from "react";
import PropTypes from "prop-types";
import { Icon } from "pi-ui";
import styles from "./styles.module.css";

const Wrapper = ({ link, children, className, ...props }) =>
  link ? (
    <a data-link href={link} className={className} {...props}>
      {children}
    </a>
  ) : (
    <div className={className} {...props}>
      {children}
    </div>
  );

export const CommentsCount = ({ link, count }) => {
  return count !== undefined ? (
    <Wrapper
      link={link}
      data-testid="comments-count"
      className={styles.countWrapper}
    >
      <Icon type="discuss" />
      <span className={styles.count}>{count}</span>
      Comments
    </Wrapper>
  ) : null;
};

CommentsCount.propTypes = {
  link: PropTypes.string,
};
