import React from "react";

const CensorMessage = ({ message }) => {
  const wrapperStyle = {
    border: "1px solid rgb(187, 187, 187)",
    borderRadius: "8px",
    padding: "10px",
    marginTop: "10px"
  };
  return (
    <div style={wrapperStyle}>
      <p>
        <span style={{ fontWeight: "bold" }}>Admin Censorship reason:</span>
        <br />
        {message}
      </p>
    </div>
  );
};

export default CensorMessage;
