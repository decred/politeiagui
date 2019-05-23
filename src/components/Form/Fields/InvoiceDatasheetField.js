import React, { useState } from "react";
import InvoiceDatasheet from "../../InvoiceDatasheet";

const CollapsableErrors = ({ errors }) => {
  const [showErrors, setShowErrors] = useState(false);
  const handleToggleErrorsVisibility = () => {
    setShowErrors(!showErrors);
  };
  const angleStyle = {
    marginLeft: "5px",
    position: "relative"
  };
  return (
    !!errors.length && (
      <div style={{ paddingLeft: "5px" }}>
        <div
          style={{
            cursor: "pointer",
            color: "#bf4153",
            fontWeight: "bold",
            display: "flex"
          }}
          onClick={handleToggleErrorsVisibility}
        >
          <span>{`${showErrors ? "Hide" : "Display"} ${
            errors.length
          } validation errors`}</span>
          <span style={angleStyle}>&#9662;</span>
        </div>
        {showErrors && (
          <ul style={{ color: "#bf4153" }}>
            {errors.map((e, idx) => (
              <li key={`lineitem-error$-${idx}`}>{e}</li>
            ))}
          </ul>
        )}
      </div>
    )
  );
};

const InvoiceDatasheetField = ({
  input: { onChange, value = [] },
  meta: { error = [], touched },
  ...props
}) => {
  if (typeof value == "string") {
    value = [];
  }
  return (
    <>
      <InvoiceDatasheet onChange={onChange} value={value} {...props} />
      {touched && <CollapsableErrors errors={error} />}
    </>
  );
};

export default InvoiceDatasheetField;
