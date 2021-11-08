import React from "react";
import { Card } from "pi-ui";

function RecordCard({ token }) {
  return (
  <Card paddingSize="medium">
    <a href={`/records/${token}`} data-link>
      I am {token}!
    </a>
  </Card>
  );
}

export default RecordCard;