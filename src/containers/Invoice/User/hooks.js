import { useEffect, useState, useMemo } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useAction, useSelector, useStoreSubscribe } from "src/redux";
import useAPIAction from "src/hooks/utils/useAPIAction";
import useThrowError from "src/hooks/utils/useThrowError";
import { handleSaveAppDraftInvoices } from "src/lib/local_storage";

export function useUserInvoices(userid) {
  const currentUserID = useSelector(sel.currentUserID);
  const userID = userid || currentUserID;
  const invoicesSelector = useMemo(
    () => sel.makeGetInvoicesByUserID(userID),
    [userID]
  );
  const invoices = useSelector(invoicesSelector);
  const onFetchUserInvoices = useAction(act.onFetchUserInvoices);

  const [loading, error] = useAPIAction(onFetchUserInvoices);

  useThrowError(error);

  return { loading, invoices };
}

export function useDraftInvoices() {
  const onLoadDraftInvoices = useAction(act.onLoadDraftInvoices);
  const onSaveDraftInvoice = useAction(act.onSaveDraftInvoice);
  const onDeleteDraftInvoice = useAction(act.onDeleteDraftInvoice);

  const draftInvoices = useSelector(sel.draftInvoices);

  const [unsubscribe] = useState(useStoreSubscribe(handleSaveAppDraftInvoices));

  useEffect(() => {
    if (!draftInvoices) {
      onLoadDraftInvoices();
    }
  }, [onLoadDraftInvoices, draftInvoices]);

  useEffect(
    function unsubscribeToStore() {
      return unsubscribe;
    },
    [unsubscribe]
  );

  return {
    onLoadDraftInvoices,
    draftInvoices,
    onSaveDraftInvoice,
    onDeleteDraftInvoice
  };
}
