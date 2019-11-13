import * as sel from "src/selectors";
import * as act from "src/actions";
import { useRedux } from "src/redux";
import useAPIAction from "src/hooks/utils/useAPIAction";
import useThrowError from "src/hooks/utils/useThrowError";

const mapStateToProps = {
  currentUserID: sel.currentUserID,
  invoices: sel.getCurrentUserInvoices
};

const mapDispatchToProps = {
  onFetchUserInvoices: act.onFetchUserInvoices
};

export function useUserInvoices(ownProps) {
  const { onFetchUserInvoices, invoices } = useRedux(
    ownProps,
    mapStateToProps,
    mapDispatchToProps
  );

  const [loading, error] = useAPIAction(onFetchUserInvoices);

  useThrowError(error);

  return { loading, invoices };
}
