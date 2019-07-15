import React from "react";
import { Message, P } from "pi-ui";
import Link from "./Link";
import { useLoaderContext } from "src/Appv2/Loader";

export const IdentityMessageError = () => {
  const { currentUser } = useLoaderContext();
  return (
    currentUser && (
      <Message kind="error">
        <P>
          Your identity is invalid. You cannot currently submit proposals or
          comments, please visit your{" "}
          <Link to={`/user/${currentUser.userid}`}>account</Link> page to
          correct this problem.
        </P>
      </Message>
    )
  );
};
