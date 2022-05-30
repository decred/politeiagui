import React from "react";
import PropTypes from "prop-types";
import { H2, P, Link } from "pi-ui";

const EmailSentMessage = ({
  email = "example@gmail.com",
  title,
  bulletPoints
}) => (
  <>
    <H2>{title}</H2>
    <P style={{ marginTop: "2rem", marginBottom: 0 }}>
      Note that, for privacy reasons, Politeia does not disclose whether an
      email address has already been registered. If you don’t receive an email:
    </P>
    <ul style={{ padding: "1rem 0" }}>
      <li>{`Check that ${email} is the correct address.`}</li>
      <li>Check your spam folder!</li>
      {bulletPoints.map((bp, idx) => (
        <li key={`bp-${idx}`}>{bp}</li>
      ))}
    </ul>
    <P>
      If you're sure you should have received an email, join the
      #support:decred.org channel on{" "}
      <Link href="https://chat.decred.org">Matrix</Link> to getassistance from
      Politeia administrators.
    </P>
  </>
);

EmailSentMessage.propTypes = {
  email: PropTypes.string,
  title: PropTypes.string,
  bulletPoints: PropTypes.array
};

EmailSentMessage.defaultProps = {
  email: "email@example.com",
  title: "Please check your email inbox",
  bulletPoints: []
};

export default EmailSentMessage;
