import React from "react";

const ButtonWithLoadingIcon = ({
  className,
  isLoading,
  text,
  ...props
}) => {
  return (
    <button className={className || "btn"} type="submit" {...props}>
      {!isLoading ? null : (
        <div className="logo spin" style={{float: "left"}} />
      )}
      <div style={{float: "right"}}>{text}</div>
      <div style={{clear: "both"}} />
    </button>
  );
};

export default ButtonWithLoadingIcon;
