import { Button } from "pi-ui";
import React from "react";
import FileDownloadLink from "./FileDownloadLink";

const PrivateKeyDownloadManager = ({ keyData }) => {
  return (
    <>
      <FileDownloadLink
        style={{ marginRight: "1.7rem" }}
        filename="politeia-pki.json"
        mime="application/json;charset=utf-8"
        data={keyData}
      >
        <Button size="sm">Download Identity</Button>
      </FileDownloadLink>
    </>
  );
};

export default PrivateKeyDownloadManager;
