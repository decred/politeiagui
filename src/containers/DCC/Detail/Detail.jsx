import React from "react";
import { withRouter } from "react-router-dom";
import get from "lodash/fp/get";
import { useDcc } from "./hooks";
import Dcc from "src/componentsv2/DCC";
import DccLoader from "src/componentsv2/DCC/DCCLoader";
import Comments from "src/containers/Comments";
import { isDccActive } from "../helpers";
import { GoBackLink } from "src/componentsv2/Router";

const DccDetail = ({ Main, match }) => {
  const dccToken = get("params.token", match);
  const threadParentCommentID = get("params.commentid", match);
  const { dcc, loading } = useDcc(dccToken);

  return (
    <>
      <Main fillScreen>
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
      </Main>
    </>
  );
};

export default withRouter(DccDetail);
