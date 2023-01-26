import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Button, H1 } from "pi-ui";
import styles from "./styles.module.css";
import { user } from "@politeiagui/core/user";

function BannerTitle({ title }) {
  const currentUser = useSelector(user.selectCurrent);
  return (
    <div className={styles.bannerTitle}>
      <H1>{title}</H1>
      {currentUser && (
        <a data-link href="/record/new">
          <Button className={styles.fullScreenButton}>New Proposal</Button>
          <Button size="sm" className={styles.xsScreenButton}>
            +
          </Button>
        </a>
      )}
    </div>
  );
}

BannerTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default BannerTitle;
