import { connect } from "react-redux";
import * as sel from "../selectors";
import * as act from "../actions";

const notificationsConnector = connect(
  sel.selectorMap({
    notifications: sel.notifications,
    isRequesting: sel.isApiRequestingNotifications,
    error: sel.apiNotificationsError,
  }),
  {
    checkNotifications: act.onCheckNotifications
  }
);

export default notificationsConnector;
