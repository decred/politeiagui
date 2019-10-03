import { createSelector } from "reselect";
import get from "lodash/fp/get";

// NEW IMPLEMENTATION
export const creditsByUserID = get(["credits", "byUserID"]);

export const makeGetUnspentUserCredits = userid =>
  createSelector(
    creditsByUserID,
    creditsByUserID =>
      (creditsByUserID[userid] && creditsByUserID[userid].unspent.length) || 0
  );

export const makeGetSpentUserCredits = userid =>
  createSelector(
    creditsByUserID,
    creditsByUserID =>
      (creditsByUserID[userid] && creditsByUserID[userid].spent.length) || 0
  );

// OLD IMLEMENTATION
export const proposalCreditsV2 = get(["credits", "proposalCredits", "credits"]);

export const proposalCreditsPurchasesV2 = () => {
  return [];
  // const { purchases } = state.credits.proposalCredits;
  // if (!purchases || !purchases.spentcredits || !purchases.unspentcredits) {
  //   return [];
  // }
  // const purchasesMap = {};
  // [...purchases.spentcredits, ...purchases.unspentcredits].forEach(credit => {
  //   if (credit.txid in purchasesMap) {
  //     purchasesMap[credit.txid].numberPurchased++;
  //   } else {
  //     purchasesMap[credit.txid] = {
  //       price: credit.price / 100000000,
  //       datePurchased: credit.datepurchased,
  //       numberPurchased: 1,
  //       txId: credit.txid
  //     };
  //   }
  // });

  // return Object.values(purchasesMap).sort(
  //   (a, b) => a.datePurchased - b.datePurchased
  // );
};
