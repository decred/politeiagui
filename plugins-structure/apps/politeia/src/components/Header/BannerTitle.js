import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { Button, H1 } from "pi-ui";
import styles from "./styles.module.css";
import { userAuth } from "@politeiagui/core/user/auth";

function BannerTitle({ title }) {
  const currentUser = useSelector(userAuth.selectCurrent);
  return (
    <div className={styles.bannerTitle}>
      <H1>{title}</H1>
      {currentUser && (
        <a
          data-link
          href="/record/new"
          data-testid="banner-new-proposal-button"
        >
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
