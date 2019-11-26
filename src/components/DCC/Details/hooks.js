import { useState, useCallback, useEffect, useMemo } from "react";
import { getDCCStatus, typesForDCC } from "../helpers";
import { DCC_SUPPORT_VOTE, DCC_OPPOSE_VOTE } from "../../../constants";

export const useDCCDetails = ({
  onLoadDCC,
  dcc,
  token,
  nomineeUsername,
  userid,
  onSupportOpposeDCC,
  loggedInAsEmail,
  isAdmin,
  supportOpposeError: error,
  confirmWithModal
}) => {
  const [loadingDCC, setLoadingDCC] = useState(true);
  const [isLoadingSupportDCC, setIsLoadingSupportDCC] = useState(false);
  const [isLoadingOpposeDCC, setIsLoadingOpposeDCC] = useState(false);

  useEffect(() => {
    const fetchDCCByToken = async () => {
      await onLoadDCC(token);
      setLoadingDCC(false);
    };
    fetchDCCByToken();
  }, [onLoadDCC, token]);

  const status = useMemo(() => dcc && getDCCStatus(dcc.status), [dcc]);
  const type = useMemo(
    () => dcc && dcc.dccpayload && typesForDCC[dcc.dccpayload.type],
    [dcc]
  );

  const onOpposeDCC = useCallback(async () => {
    setIsLoadingOpposeDCC(true);
    await onSupportOpposeDCC(loggedInAsEmail, token, DCC_OPPOSE_VOTE);
    setIsLoadingOpposeDCC(false);
  }, [token, onSupportOpposeDCC, loggedInAsEmail, setIsLoadingOpposeDCC]);

  const onSupportDCC = useCallback(async () => {
    setIsLoadingSupportDCC(true);
    await onSupportOpposeDCC(loggedInAsEmail, token, DCC_SUPPORT_VOTE);
    setIsLoadingSupportDCC(false);
  }, [token, onSupportOpposeDCC, loggedInAsEmail, setIsLoadingSupportDCC]);

  const userCanVote = useMemo(() => {
    const hasUserSupported =
      dcc && dcc.supportuserids && dcc.supportuserids.indexOf(userid) !== -1;
    const hasUserOpposed =
      dcc && dcc.againstuserids && dcc.againstuserids.indexOf(userid) !== -1;
    const isUserSponsor = dcc && dcc.sponsoruserid === userid;
    return !hasUserSupported && !hasUserOpposed && !isUserSponsor;
  }, [dcc, userid]);

  return {
    dcc,
    userCanVote,
    loadingDCC,
    status,
    type,
    nomineeUsername,
    onSupportDCC,
    onOpposeDCC,
    error,
    isLoadingOpposeDCC,
    isLoadingSupportDCC,
    confirmWithModal,
    isAdmin
  };
};
