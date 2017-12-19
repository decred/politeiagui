import React from "react";

const Message = ({
  type,
  header,
  body
}) => {
  const mapTypeToIcon = {
    success: "✔",
    error: "✖",
    info: "ℹ︎"
  }
  const icon = mapTypeToIcon[type] ? mapTypeToIcon[type] : mapTypeToIcon.error;
  return (
    <div className={"message-ct message-" + type}>
      <div className="message-icon">{icon}</div>
        <div className="message-text">
          <div className="message-header">{header}</div>
            <div className="message-body">
              {(body instanceof Error) ? body.message : body}
            </div>
        </div>
    </div>
  )
};

export default Message;
