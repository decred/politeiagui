import React from "react";

const Message = ({
  type,
  header,
  body,
  height
}) => {
  const mapTypeToIcon = {
    success: "✔",
    error: "✖",
    info: "ℹ︎"
  };
  const icon = mapTypeToIcon[type] ? mapTypeToIcon[type] : mapTypeToIcon.error;
  return (
    <div className={"message-ct message-" + type} style={{height: height}}>
      <div className="message-icon" style={{height, lineHeight: height}}>{icon}</div>
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
