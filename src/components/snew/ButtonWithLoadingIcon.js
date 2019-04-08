import React from "react";

const ButtonWithLoadingIcon = ({
  className,
  isLoading,
  text,
  loadingIconStyle = {},
  ...props
}) => {
  return (
    <button
      className={`btn ${isLoading ? "loading" : ""} ${className}`}
      {...props}
      onClick={isLoading ? () => null : props.onClick}
    >
      {isLoading ? (
        <i
          className="fa fa-circle-o-notch fa-spin right-margin-5"
          style={{ fontSize: "14px", ...loadingIconStyle }}
        />
      ) : null}
      <div style={{ whiteSpace: "normal" }}>{text}</div>
      <div style={{ clear: "both" }} />
    </button>
  );
};

export default ButtonWithLoadingIcon;
