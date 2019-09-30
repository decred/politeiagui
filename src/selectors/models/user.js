import get from "lodash/fp/get";

export const proposalCreditsV2 = get(["user", "proposalCredits", "credits"]);

export const proposalCreditsPurchasesV2 = state => {
  const { purchases } = state.user.proposalCredits;
  if (!purchases || !purchases.spentcredits || !purchases.unspentcredits) {
    return [];
  }
  const purchasesMap = {};
  [...purchases.spentcredits, ...purchases.unspentcredits].forEach(credit => {
    if (credit.txid in purchasesMap) {
      purchasesMap[credit.txid].numberPurchased++;
    } else {
      purchasesMap[credit.txid] = {
        price: credit.price / 100000000,
        datePurchased: credit.datepurchased,
        numberPurchased: 1,
        txId: credit.txid
      };
    }
  });

  return Object.values(purchasesMap).sort(
    (a, b) => a.datePurchased - b.datePurchased
  );
};
