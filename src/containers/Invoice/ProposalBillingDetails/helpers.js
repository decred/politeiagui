import { SUB_HOURS_LINE_ITEM } from "../constants";
import map from "lodash/fp/map";
import flow from "lodash/fp/flow";
import sum from "lodash/fp/sum";
import filter from "lodash/fp/filter";
import head from "lodash/fp/head";
import get from "lodash/fp/get";
export { getInvoiceTotalExpenses } from "../helpers";

export const TABLE_HEADERS = [
  "Month",
  "Year",
  "User",
  "Contractor Rate",
  "Exchange Rate",
  "Labor (hours)",
  "Expense (USD)",
  "Total (DCR)",
  "Total (USD)",
  "Invoice"
];

export const isSubContractorLineItem = (item) =>
  item.type === SUB_HOURS_LINE_ITEM;

export const getSubContractorTotal = (lineItems) =>
  lineItems
    .filter(isSubContractorLineItem)
    .reduce(
      (acc, lineItem) => acc + (lineItem.subrate * lineItem.labor) / 60,
      0
    );

export const getInvoiceTotal = (rate, lineItems) => {
  const laborInMinutes = lineItems
    .filter((item) => !isSubContractorLineItem(item))
    .reduce((acc, cur) => acc + cur.labor, 0);

  const expensesInUsd = lineItems.reduce((acc, cur) => acc + cur.expenses, 0);
  const laborInHours = laborInMinutes / 60;

  return laborInHours * rate + expensesInUsd; // total
};

export const getInvoiceTotalLabor = (lineItems) =>
  flow(
    map(({ labor }) => labor),
    sum
  )(lineItems);

const getSubContractorsInfo = (lineItems) =>
  filter(isSubContractorLineItem)(lineItems);

export const getSubContractorTotalLabor = (lineItems) =>
  flow(getSubContractorsInfo, getInvoiceTotalLabor)(lineItems);

export const getSubContractorRate = (lineItems) =>
  flow(getSubContractorsInfo, head, get("subrate"))(lineItems);

export const getSubContractor = (lineItems, subContractors = []) => {
  const id = flow(getSubContractorsInfo, head, get("subuserid"))(lineItems);
  return subContractors.find((sc) => sc.id === id);
};
