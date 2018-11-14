import React from "react";

const Message = ({
  type,
  header,
  body,
  children,
  height,
  className,
  onDismissClick
}) => {
  const mapTypeToIcon = {
    success: "✔",
    error: "✖",
    info: "ℹ︎"
  };
  const icon = mapTypeToIcon[type] ? mapTypeToIcon[type] : mapTypeToIcon.error;

  if (className) {
    className = " " + className;
  } else {
    className = "";
  }

  return (
    <div
      className={"message-ct message-" + type + className}
      style={{ height: height }}
    >
      <div className="message-icon" style={{ lineHeight: height }}>
        {icon}
      </div>
      <div className="message-text" style={{ flexGrow: "1" }}>
        {header ? <div className="message-header">{header}</div> : null}
        <div className="message-body">
          {body ? (
            <span style={{ whiteSpace: "pre-wrap" }}>
              {body instanceof Error ? body.message : body}
            </span>
          ) : null}
          {children ? children : null}
        </div>
      </div>
      {onDismissClick && (
        <span style={{ padding: "10px" }}>
          <span
            style={{
              cursor: "pointer",
              fontSize: "15px"
            }}
            onClick={onDismissClick}
          >
            ✖
          </span>
        </span>
      )}
    </div>
  );
};

export default Message;
