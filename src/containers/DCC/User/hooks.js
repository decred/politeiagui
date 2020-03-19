import { useState, useEffect } from "react";
import * as sel from "src/selectors";
import * as act from "src/actions";
import { useAction, useSelector, useStoreSubscribe } from "src/redux";
import { handleSaveAppDraftDccs } from "src/lib/local_storage";

export function useDraftDccs() {
  const onLoadDraftDccs = useAction(act.onLoadDraftDccs);
  const onSaveDraftDcc = useAction(act.onSaveDraftDcc);
  const onDeleteDraftDcc = useAction(act.onDeleteDraftDcc);

  const draftDccs = useSelector(sel.draftDccs);

  const [unsubscribe] = useState(useStoreSubscribe(handleSaveAppDraftDccs));

  useEffect(() => {
    onLoadDraftDccs();
  }, [onLoadDraftDccs]);

  useEffect(
    function unsubscribeToStore() {
      return unsubscribe;
    },
    [unsubscribe]
  );

  return {
    onLoadDraftDccs,
    draftDccs,
    onSaveDraftDcc,
    onDeleteDraftDcc
  };
}
