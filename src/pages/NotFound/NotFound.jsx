import React from "react";
import { withRouter } from "react-router-dom";
import SingleContentPage from "src/components/layout/SingleContentPage";
import { H1, Button } from "pi-ui";
import notFoundImage from "./notFound.svg";
import styles from "./NotFound.module.css";

const PageNotFound = ({ history }) => {
  const goToHomePage = () => history.push("/");
  return (
    <SingleContentPage noCardWrap>
      <div className={styles.contentWrapper}>
        <H1>Page not found</H1>
        <img
          alt="Not Found"
          className={styles.notFoundImg}
          src={notFoundImage}
        />
        <Button className={styles.returnHomeBtn} onClick={goToHomePage}>
          Return home
        </Button>
      </div>
    </SingleContentPage>
  );
};

export default withRouter(PageNotFound);
