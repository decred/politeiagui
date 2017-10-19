import React from "react";

const Message = ({
  type,
  header,
  body,
  error
}) => (
  <div className={"message-ct message-" + type}>
    <div className="message-icon">{type === "success" ? "✔" : "✖"}</div>
    <div className="message-text">
      <div className="message-header">{header}</div>
      <div className="message-body">{error ? (
        (error instanceof Error) ? (
          error.message
        ) : (
          JSON.stringify(error, null, 2)
        )
      ) : body}</div>
    </div>
  </div>
);

export default Message;
