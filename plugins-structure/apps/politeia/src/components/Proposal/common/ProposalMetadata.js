import React from "react";
import { LabelValueList } from "@politeiagui/common-ui";
import {
  formatDateToInternationalString,
  formatUnixTimestampToObj,
  usdFormatter,
} from "@politeiagui/common-ui/utils";

function getMetadataItems({ domain, amount, endDate, startDate }) {
  return [
    { label: "Domain", value: domain },
    { label: "Amount", value: usdFormatter.format(amount / 100) },
    { label: "Start Date", value: startDate },
    { label: "End Date", value: endDate },
  ];
}

function ProposalMetadata({ metadata }) {
  const { amount, startdate, enddate, domain } = metadata;
  const metadataAvailable = !!amount || !!domain || !!startdate || !!enddate;
  if (!metadataAvailable) return;

  const startDate = formatDateToInternationalString(
    (startdate && formatUnixTimestampToObj(startdate)) || {}
  );
  const endDate = formatDateToInternationalString(
    (enddate && formatUnixTimestampToObj(enddate)) || {}
  );
  const items = getMetadataItems({ domain, amount, endDate, startDate });
  return metadataAvailable && <LabelValueList items={items} />;
}
export default ProposalMetadata;
