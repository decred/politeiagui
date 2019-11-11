import React from "react";
import { convertAtomsToDcr, formatUnixTimestamp } from "src/utilsv2";
import InfoSection from "../../InfoSection.jsx";

export default ({ amount, timestamp }) =>
  <>
    <InfoSection
      label="Amount:"
      info={`${convertAtomsToDcr(amount)} DCR`}
    />
    <InfoSection
      label="Pay after:"
      info={formatUnixTimestamp(timestamp)}
    />
  </>;
