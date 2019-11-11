import React from "react";
import InfoSection from "../../InfoSection.jsx";

export default ({ address }) =>
  <InfoSection
    label="Address:"
    info={
      <span style={{ wordBreak: "break-word" }}>
        {address}
      </span>
    }
  />;
