import { createSelector } from "reselect";
import get from "lodash/fp/get";
import orderBy from "lodash/fp/orderBy";

export const payouts = get(["invoicePayouts", "payouts"]);
export const payoutSummaries = get(["invoicePayouts", "payoutSummaries"]);

export const lineItemPayouts = createSelector(
  payoutSummaries,
  (invoices = []) =>
    orderBy(
      ["timestamp"],
      ["asc"]
    )(
      invoices.reduce(
        (acc, invoice) =>
          acc.concat(
            invoice.input.lineitems.map((lineItem) => ({
              ...lineItem,
              timestamp: invoice.timestamp,
              token: invoice.censorshiprecord.token,
              labor:
                (lineItem.labor / 60) * (invoice.input.contractorrate / 100),
              expenses: lineItem.expenses / 100,
              description: lineItem.description.replace(/#/g, ""),
              month: invoice.input.month,
              year: invoice.input.year,
              paiddate: new Date(
                invoice.payment.timelastupdated * 1000
              ).toLocaleString(),
              amountreceived: invoice.payment.amountreceived / 100000000
            }))
          ),
        []
      )
    )
);
