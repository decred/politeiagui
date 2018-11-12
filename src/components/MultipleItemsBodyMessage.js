import React from "react";

const MultipleItemsBodyMessage = ({ items }) =>
  Array.isArray(items) ? (
    <ul>
      {items.map((error, i) => (
        <li key={i} style={{ padding: "3px 0px" }}>
          {error}
        </li>
      ))}
    </ul>
  ) : items instanceof Error ? (
    items.message
  ) : (
    items
  );

export default MultipleItemsBodyMessage;
