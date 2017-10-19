import React from "react";

const Message = ({
  type,
  header,
  body,
  error
}) => (
  <div class={"message-ct message-" + type}>
    <div class="message-icon">{type === "success" ? "✔" : "✖"}</div>
    <div class="message-text">
      <div class="message-header">{header}</div>
      <div class="message-body">{error ? (
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
