import { createSelector } from "reselect";
import get from "lodash/fp/get";

export const creditsByUserID = get(["credits", "byUserID"]);

export const makeGetUnspentUserCredits = userid =>
  createSelector(
    creditsByUserID,
    creditsByUserID =>
      creditsByUserID[userid] ? creditsByUserID[userid].unspent : []
  );

export const makeGetSpentUserCredits = userid =>
  createSelector(
    creditsByUserID,
    creditsByUserID =>
      creditsByUserID[userid] ? creditsByUserID[userid].spent : []
  );

export const makeGetUnspentUserCreditsLength = userid => {
  const unspentUserCredits = makeGetUnspentUserCredits(userid);
  return createSelector(
    unspentUserCredits,
    unspentCredits => unspentCredits.length
  );
};

export const makeGetSpentUserCreditsLength = userid => {
  const spentUserCredits = makeGetSpentUserCredits(userid);
  return createSelector(
    spentUserCredits,
    spentCredits => spentCredits.length
  );
};

export const makeGetUserCreditsPurchasesByTx = userid => {
  const spentUserCredits = makeGetSpentUserCredits(userid);
  const unspentUserCredits = makeGetUnspentUserCredits(userid);

  return createSelector(
    spentUserCredits,
    unspentUserCredits,
    (spent, unspent) => {
      const groupedCredits =
        spent &&
        unspent &&
        [...spent, ...unspent].reduce((result, credit) => {
          if (credit.txid in result) {
            result[credit.txid].numberPurchased++;
          } else {
            result[credit.txid] = {
              price: credit.price / 100000000,
              datePurchased: credit.datepurchased,
              numberPurchased: 1,
              txId: credit.txid
            };
          }
          return result;
        }, []);
      const sortedCredits = Object.values(groupedCredits).sort(
        (a, b) => a.datePurchased - b.datePurchased
      );
      return sortedCredits;
    }
  );
};
