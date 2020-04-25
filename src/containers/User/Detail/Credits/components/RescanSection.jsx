import React from "react";
import { Message } from "pi-ui";

export default ({ amountOfCreditsAddedOnRescan, errorRescan }) =>
  <>
    {amountOfCreditsAddedOnRescan !== null &&
     amountOfCreditsAddedOnRescan !== undefined && (
      <Message className="margin-top-s" kind="success">
        User credits are up to date. {amountOfCreditsAddedOnRescan} proposal
        credits were found by the rescan and added to the user account.
      </Message>
    )}
    {errorRescan && (
      <Message className="margin-top-s" kind="error">
        {errorRescan.toString()}
      </Message>
    )}
  </>;
