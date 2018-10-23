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
      className={className || "btn"}
      type="submit"
      {...props}
      onClick={isLoading ? () => null : props.onClick}
    >
      {isLoading ? (
        <i
          className="fa fa-circle-o-notch fa-spin right-margin-5"
          style={{ fontSize: "14px", ...loadingIconStyle }}></i>
      ) : null}
      <div style={{ float: "right" }}>{text}</div>
      <div style={{ clear: "both" }} />
    </button>
  );
};

export default ButtonWithLoadingIcon;
