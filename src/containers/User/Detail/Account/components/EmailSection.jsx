import React from "react";
import { isUserEmailVerified } from "../../helpers";
import InfoSection from "../../InfoSection.jsx";

export default ({ token }) => (
  <InfoSection
    label="Verified email"
    info={isUserEmailVerified(token) ? "Yes" : "No"}
  />
);
