import { Button } from "pi-ui";
import React, { useEffect, useState } from "react";
import useUserIdentity from "src/hooks/api/useUserIdentity";
import * as pki from "src/lib/pki";
import FileDownloadLink from "./FileDownloadLink";

const fetchKeys = (loggedInAsEmail) =>
  pki
    .getKeys(loggedInAsEmail)
    .then(keys => JSON.stringify(keys, null, 2));

const PrivateKeyDownloadManager = () => {
  const {
    keyMismatch,
    loggedInAsEmail
  } = useUserIdentity();

  const [keyData, setKeyData] = useState();

  useEffect(() => {
    fetchKeys(loggedInAsEmail).then(keyData => {
      setKeyData(keyData);
    });
  }, [loggedInAsEmail]);

  return (
    <>
      {keyData && !keyMismatch && (
        <FileDownloadLink
          style={{ marginRight: "1.7rem" }}
          filename="politeia-pki.json"
          mime="application/json;charset=utf-8"
          data={keyData}
        >
          <Button size="sm">Download Identity</Button>
        </FileDownloadLink>
      )}
    </>
  );
};

export default PrivateKeyDownloadManager;
