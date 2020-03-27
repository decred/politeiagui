import React from "react";

/* This component is important for accessibility porposes. More info: https://www.chromium.org/developers/design-documents/create-amazing-password-forms */
export default function HiddenUsernameField() {
  return (
    <input
      type="text"
      autoComplete="username"
      style={{ visibility: "hidden" }}
    />
  );
}
