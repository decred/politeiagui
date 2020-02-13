import * as external_api from "src/lib/external_api";
import * as act from "src/actions";
import * as sel from "src/selectors";
import { useAction, useSelector } from "src/redux";
import { useEffect, useState } from "react";

export function useNewInvoice() {
  return {
    onSubmitInvoice: useAction(act.onSaveNewInvoice)
  };
}

export function useApprovedProposalsTokens() {
  const isTestnet = useSelector(sel.isTestNet);
  const [approvedTokens, setApprovedTokens] = useState([]);
  useEffect(() => {
    external_api
      .getCmsApprovedProposalsTokens(isTestnet)
      .then((res) => setApprovedTokens(res));
  }, [isTestnet]);
  return approvedTokens;
}
