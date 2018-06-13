import React from "react";
import LoadingIcon from "./LoadingIcon";

const ButtonWithLoadingIcon = ({
  className,
  isLoading,
  text,
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
        <LoadingIcon
          width={20}
          style={{
            display: "block",
            float: "left",
            marginRight: "8px",
          }} />
      ) : null}
      <div style={{float: "right"}}>{text}</div>
      <div style={{clear: "both"}} />
    </button>
  );
};

export default ButtonWithLoadingIcon;
