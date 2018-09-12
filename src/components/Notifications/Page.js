import React, { Component } from "react";
import PageLoadingIcon from "../snew/PageLoadingIcon";
import Message from "../Message";
import { NotificationsList } from "./NotificationsList";

class NotificationsPage extends Component {
  markAllAsRead = () => {
    const notificationsIds = this.props.notifications.map(n => n.notificationid);
    this.props.checkNotifications(notificationsIds);
  }
  markOneAsRead = (notificationid) => {
    this.props.checkNotifications([notificationid]);
  }

  sortNotifications = () =>
    this.props.notifications ? this.props.notifications.sort((x, y) =>
      y.timestamp - x.timestamp
    ) : null;

  render() {
    const { isRequesting, error } = this.props;
    return error ? (
      <Message
        type="error"
        header="Error loading notifications"
        body={error} />
    ) :
      isRequesting ? (
        <PageLoadingIcon key="notifications" />
      ) :
        (
          <div className="content" role="main">
            <div className="page">
              <h1>Notifications</h1>
              <NotificationsList
                notifications={this.sortNotifications()}
                markAllAsRead={this.markAllAsRead}
                markOneAsRead={this.markOneAsRead}
              />
            </div>
          </div>
        );
  }
}

export default NotificationsPage;
