import * as external_api from "src/lib/external_api";
import * as sel from "src/selectors";
import { useSelector } from "src/redux";
import { useEffect, useState } from "react";

export function useApprovedProposalsTokens() {
  const isTestnet = useSelector(sel.isTestNet);
  const [approvedTokens, setApprovedTokens] = useState([]);
  useEffect(() => {
    external_api.getCmsApprovedProposalsTokens(isTestnet).then((res) => {
      setApprovedTokens(res.approved);
    });
  }, [isTestnet]);
  return approvedTokens;
}
