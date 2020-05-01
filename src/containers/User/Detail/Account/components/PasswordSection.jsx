import React from "react";
import InfoSection from "../../InfoSection.jsx";
import { Button } from "pi-ui";

export default ({ onClick }) => (
  <InfoSection
    label="Password:"
    alignLabelCenter
    info={
      <Button size="sm" onClick={onClick}>
        Change Password
      </Button>
    }
  />
);
