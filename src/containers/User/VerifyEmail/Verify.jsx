import React from "react";
import { useVerifyUserEmail } from "./hooks";
import { H2, P } from "pi-ui";
import LoadingWithMessage from "src/componentsv2/LoadingWithMessage";

const VerifyEmail = () => {
  const { success, loading, error } = useVerifyUserEmail();

  //   we let the error boundary catch the error
  if (error) throw error;

  return loading || !success ? (
    <LoadingWithMessage
      message={"Verifying email..."}
      spinnerProps={{ invert: true }}
    />
  ) : (
    <>
      <H2>Your email has been successfully verified</H2>
      <P style={{ marginTop: "2rem" }}>
        To complete your registration and to be able to submit proposals and
        comments, you must pay a small fee in DCR, which is used to help deter
        spam in Politeia.
      </P>
      <P>
        Please log in to find instructions on how to pay the registration fee.
      </P>
    </>
  );
};

export default VerifyEmail;
