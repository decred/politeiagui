import * as act from "src/actions";
import { useRedux } from "src/redux";

const mapStateToProps = {};

const mapDispatchToProps = {
  onSubmitInvoice: act.onSaveNewInvoice
};

export function useNewInvoice(ownProps) {
  const fromRedux = useRedux(ownProps, mapStateToProps, mapDispatchToProps);

  return fromRedux;
}
