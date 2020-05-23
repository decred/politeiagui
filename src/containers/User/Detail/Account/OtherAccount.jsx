import { Card, classNames } from "pi-ui";
import PropTypes from "prop-types";
import React from "react";
import InfoSection from "../InfoSection.jsx";
import { isUserAdmin } from "../helpers";

const OtherAccount = ({
  isadmin // from the user API return
}) => (
  <Card className={classNames("container", "margin-bottom-m")}>
    <InfoSection
      className="no-margin-top"
      label="Admin"
      info={isUserAdmin(isadmin) ? "Yes" : "No"}
    />
  </Card>
);

OtherAccount.propTypes = {
  isadmin: PropTypes.bool
};

export default OtherAccount;
