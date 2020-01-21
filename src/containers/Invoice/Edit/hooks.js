import * as act from "src/actions";
import { useRedux } from "src/redux";

const mapStateToProps = {};

const mapDispatchToProps = {
  onEditInvoice: act.onEditInvoice
};

export function useEditInvoice(ownProps) {
  return useRedux(ownProps, mapStateToProps, mapDispatchToProps);
}
