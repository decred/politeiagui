import React from "react";
import Message from "../Message";
import PageLoadingIcon from "../snew/PageLoadingIcon";

const Page = ({
  verifyNewUser,
  isRequestingVerifyNewUser,
  verifyNewUserError
}) => {
  return isRequestingVerifyNewUser ? (
    <PageLoadingIcon />
  ) : verifyNewUserError ? (
    <div className="page verification-failure-page">
      {verifyNewUserError.errorCode === 23 ? (
        <Message type="error" header="Verification failed">
          <p>
            The provided signature was invalid, which is usually caused from the
            local data on your browser being cleared or by using a different
            browser from the one you registered with.
          </p>
          <p>
            Please open the link from your verification email in the same
            browser that you used to register.
          </p>
        </Message>
      ) : (
        <Message
          type="error"
          header="Verification failed"
          body={verifyNewUserError.message}
        />
      )}
    </div>
  ) : verifyNewUser ? (
    <div className="page verification-success-page">
      <h3>Your email has been successfully verified.</h3>
      <p>
        To complete your registration and to be able to submit proposals and
        comments, you must pay a small fee in DCR, which is used to help deter
        spam in Politeia.
      </p>
      <p>
        Please log in to find instructions on how to pay the registration fee.
      </p>
    </div>
  ) : null;
};

export default Page;
