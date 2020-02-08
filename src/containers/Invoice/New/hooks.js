import * as act from "src/actions";
import * as sel from "src/selectors";
import { useRedux } from "src/redux";

const mapStateToProps = {
  proposalsTokens: sel.apiTokenInventoryResponse
};

const mapDispatchToProps = {
  onSubmitInvoice: act.onSaveNewInvoice,
  onFetchTokenInventory: act.onFetchTokenInventory
};

export function useNewInvoice(ownProps) {
  return useRedux(ownProps, mapStateToProps, mapDispatchToProps);
}
