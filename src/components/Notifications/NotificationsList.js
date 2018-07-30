import React from "react";
import { getNotificationIdentifier } from "../../helpers";
import TimeAgo from "timeago-react";
import { areAllNotificationsViewed } from "../../helpers";

const getNotificationURL = (type, context) =>
  (type === 3 || type === 4 || type === 5) ? `/proposals/${context}`
    : "/user/account";

const getContext = (notification) =>
  notification.contextinfo ? notification.contextinfo[0] : null;

export const NotificationsList = ({
  notifications,
  markAllAsRead,
  markOneAsRead
}) =>
  <React.Fragment>
    {!notifications || notifications.length === 0 ?
      <h1 style={{ textAlign: "center", paddingTop: "125px", color: "#777" }}>
        You don't have any notification
      </h1>
      :
      <ul style={{border: "1px solid #ccc", borderBottom: "0", borderRadius: "3px"}}>
        {
          <React.Fragment>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              minHeight: "50px",
              backgroundColor: "#ccc",
              padding: "12px 10px 12px 10px",
              borderRadius: "3px 3px 0 0"
            }}>
              <h3 style={{color: "#333"}}>Proposals</h3>
              {!areAllNotificationsViewed(notifications) ?
                <a style={{
                  cursor: "pointer",
                  backgroundColor: "#f4f7f9",
                  padding: "5px 7px",
                  borderRadius: "2px"
                }}
                onClick={markAllAsRead}>
                    Mark all as read
                </a>
                : null
              }
            </div>
            {
              notifications.map((notification, i) =>
                <li
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "15px 10px 15px 10px",
                    borderBottom: "1px solid #ccc",
                    backgroundColor: notification.viewed ? "transparent" : "#ddd"
                  }}>
                  <a
                    style={{maxWidth: "328px", cursor: "pointer"}}
                    onClick={() => markOneAsRead(notification.notificationid)}
                    href={getNotificationURL(notification.notificationtype, getContext(notification))}>
                    {getNotificationIdentifier(notification.notificationtype, getContext(notification))}
                  </a>
                  <span>
                    <TimeAgo
                      datetime={notification.timestamp * 1000}/>
                    {notification.viewed ?
                      null
                      :
                      <span
                        onClick={() => markOneAsRead(notification.notificationid)}
                        style={{
                          cursor: "pointer",
                          marginLeft: "15px",
                          padding: "2px 4px",
                          borderRadius: "50%",
                          border: "1px solid #000"
                        }}>
                        &#x2714;
                      </span>
                    }
                  </span>
                </li>
              )
            }
          </React.Fragment>
        }
      </ul>
    }
  </React.Fragment>;
