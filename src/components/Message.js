import React from "react";

const Message = ({
  type,
  header,
  body
}) => (
  <div className={"message-ct message-" + type}>
    <div className="message-icon">{type === "success" ? "✔" : "✖"}</div>
    <div className="message-text">
      <div className="message-header">{header}</div>
      <div className="message-body">
        {(body instanceof Error) ? body.message : body}
      </div>
    </div>
  </div>
);

export default Message;
