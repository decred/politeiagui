import React from "react";
import { isUserAdmin } from "../../helpers";
import InfoSection from "../../InfoSection.jsx";

export default ({ isadmin }) => (
  <InfoSection
    className="no-margin-top"
    label="Admin"
    info={isUserAdmin(isadmin) ? "Yes" : "No"}
  />
);
