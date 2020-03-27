import React from "react";
import { withRouter } from "react-router-dom";
import get from "lodash/fp/get";
import { useDcc } from "./hooks";
import Dcc from "src/components/DCC";
import DccLoader from "src/components/DCC/DccLoader";
import Comments from "src/containers/Comments";
import { AdminDccActionsProvider } from "src/containers/DCC/Actions";
import { isDccActive } from "../helpers";
import { GoBackLink } from "src/components/Router";

const DccDetail = ({ Main, match }) => {
  const dccToken = get("params.token", match);
  const threadParentCommentID = get("params.commentid", match);
  const { dcc, loading } = useDcc(dccToken);

  return (
    <>
      <Main fillScreen>
        <AdminDccActionsProvider>
          <GoBackLink />
          {dcc && !loading ? (
            <Dcc dcc={dcc} extended />
          ) : (
            <DccLoader extended />
          )}
          <Comments
            recordAuthorID={dcc && dcc.sponsoruserid}
            recordToken={dccToken}
            threadParentID={threadParentCommentID}
            readOnly={dcc && !isDccActive(dcc)}
            readOnlyReason={
              "This DCC can no longer receive comments due its current status."
            }
          />
        </AdminDccActionsProvider>
      </Main>
    </>
  );
};

export default withRouter(DccDetail);
