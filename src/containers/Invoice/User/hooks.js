import { useEffect, useState, useMemo } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useAction, useSelector, useRedux, useStoreSubscribe } from "src/redux";
import useAPIAction from "src/hooks/utils/useAPIAction";
import useThrowError from "src/hooks/utils/useThrowError";
import { handleSaveAppDraftInvoices } from "src/lib/local_storage";

export function useUserInvoices() {
  const invoices = useSelector(sel.getCurrentUserInvoices);
  const onFetchUserInvoices = useAction(act.onFetchUserInvoices);

  const [loading, error] = useAPIAction(onFetchUserInvoices);

  useThrowError(error);

  return { loading, invoices };
}

export function useDraftInvoices() {
  const mapStateToProps = useMemo(
    () => ({
      draftInvoices: sel.draftInvoices
    }),
    []
  );
  const mapDispatchToProps = useMemo(
    () => ({
      onLoadDraftInvoices: act.onLoadDraftInvoices,
      onSaveDraftInvoice: act.onSaveDraftInvoice,
      onDeleteDraftInvoice: act.onDeleteDraftInvoice
    }),
    []
  );
  const fromRedux = useRedux({}, mapStateToProps, mapDispatchToProps);
  const [unsubscribe] = useState(useStoreSubscribe(handleSaveAppDraftInvoices));
  const { onLoadDraftInvoices, draftInvoices } = fromRedux;

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

  return fromRedux;
}
