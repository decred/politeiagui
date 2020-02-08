import { useMemo, useEffect } from "react";
import * as act from "src/actions";
import * as sel from "src/selectors";
import { useRedux, useSelector, useAction } from "src/redux";

const mapStateToProps = {};

const mapDispatchToProps = {
  onSubmitInvoice: act.onSaveNewInvoice
};

export function useNewInvoice(ownProps) {
  const onFetchTokenInventory = useAction(act.onFetchTokenInventory);
  const proposalsTokens = useSelector(sel.apiTokenInventoryResponse);
  const approvedProposalsTokens = useMemo(
    () => proposalsTokens && proposalsTokens.approved,
    [proposalsTokens]
  );

  useEffect(() => {
    !proposalsTokens && onFetchTokenInventory();
  }, [onFetchTokenInventory, proposalsTokens]);

  const { onSubmitInvoice } = useRedux(
    ownProps,
    mapStateToProps,
    mapDispatchToProps
  );
  return {
    onSubmitInvoice,
    approvedProposalsTokens
  };
}
