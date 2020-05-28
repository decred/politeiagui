import React, { useCallback } from "react";
import { Button } from "pi-ui";
import { withRouter } from "react-router-dom";
import qs from "query-string";
import EmailSentMessage from "src/components/EmailSentMessage";
import SingleContentPage from "src/components/layout/SingleContentPage";
import DevelopmentOnlyContent from "src/components/DevelopmentOnlyContent";

const PageRequestPasswordMessage = ({ location, history }) => {
  const { verificationtoken, username } = qs.parse(location.search);
  const pushToResetPage = useCallback(
    () =>
      history.push(
        `/user/password/reset?username=${username}&verificationtoken=${verificationtoken}`
      ),
    [history, username, verificationtoken]
  );

  return (
    <SingleContentPage>
      <EmailSentMessage
        email={"your email"}
        title={"Please check your mailbox to reset your password"}
      />
      {verificationtoken && (
        <div className="margin-top-l">
          <DevelopmentOnlyContent show={verificationtoken}>
            <Button onClick={pushToResetPage} type="button">
              Auto Verify
            </Button>
          </DevelopmentOnlyContent>
        </div>
      )}
    </SingleContentPage>
  );
};

export default withRouter(PageRequestPasswordMessage);
