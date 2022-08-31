import React from "react";
import { LabelValueList } from "@politeiagui/common-ui";
import {
  formatDateToInternationalString,
  formatUnixTimestampToObj,
  usdFormatter,
} from "@politeiagui/common-ui/utils";

function getMetadataItems({ domain, amount, endDate, startDate }) {
  const items = [];
  if (domain) items.push({ label: "Domain", value: domain });
  if (amount)
    items.push({ label: "Amount", value: usdFormatter.format(amount / 100) });
  if (startDate) items.push({ label: "Start Date", value: startDate });
  if (endDate) items.push({ label: "End Date", value: endDate });
  return items;
}

function ProposalMetadata({ metadata }) {
  const { amount, startdate, enddate, domain } = metadata;
  const metadataAvailable = !!amount || !!domain || !!startdate || !!enddate;
  if (!metadataAvailable) return null;

  const startDate =
    startdate &&
    formatDateToInternationalString(formatUnixTimestampToObj(startdate));
  const endDate =
    enddate &&
    formatDateToInternationalString(formatUnixTimestampToObj(enddate));
  const items = getMetadataItems({ domain, amount, endDate, startDate });
  return <LabelValueList items={items} data-testid="proposal-metadata" />;
}

export default ProposalMetadata;
