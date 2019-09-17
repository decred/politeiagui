import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

export default connect(
  sel.selectorMap({
    lineItemPayouts: sel.lineItemPayouts,
    error: sel.generatePayoutsError,
    loading: sel.isApiRequestingInvoicePayouts,
    loggedInAsEmail: sel.loggedInAsEmail,
    startMonthFilterValue: sel.getStartMonthPayoutFilterValue,
    startYearFilterValue: sel.getStartYearPayoutFilterValue,
    endMonthFilterValue: sel.getEndMonthPayoutFilterValue,
    endYearFilterValue: sel.getEndYearPayoutFilterValue
  }),
  {
    onInvoicePayouts: act.onInvoicePayouts,
    onChangeEndPayoutDateFilter: act.onChangeEndPayoutDateFilter,
    onChangeStartPayoutDateFilter: act.onChangeStartPayoutDateFilter,
    onResetStartPayoutDateFilter: act.onResetStartPayoutDateFilter,
    onResetEndPayoutDateFilter: act.onResetEndPayoutDateFilter
  }
);
