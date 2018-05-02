import React from "react";

const Message = ({
  type,
  header,
  body,
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

  if(className) {
    className = " " + className;
  } else {
    className = "";
  }

  return (
    <div className={"message-ct message-" + type + className} style={{height: height, zIndex: "9999"}}>
      <div
        className="message-icon"
        style={{height, display: "flex", alignItems: "center"}}
      >
        <i style={{padding: "0 10px"}}>
          {icon}
        </i>
      </div>
      <div className="message-text" style={{flexGrow: "1"}}>
        <div className="message-header">{header}</div>
        <div className="message-body">
          {(body instanceof Error) ?
            body.message :
            Array.isArray(body) ?
              <ul>
                {body.map((error, i) =>
                  <li key={i} style={{padding: "3px 0px"}}>
                    {error}
                  </li>
                )}
              </ul>
              :
              body
          }
        </div>
      </div>
      {onDismissClick &&
        <span style={{padding: "10px"}}>
          <i
            style={{
              cursor: "pointer",
              fontSize: "18px"
            }}
            onClick={onDismissClick}
          >
              x
          </i>
        </span>
      }
    </div>
  );
};

export default Message;
