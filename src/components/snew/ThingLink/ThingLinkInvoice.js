import React from "react";
import { DateTooltip } from "snew-classic-ui";
import * as modalTypes from "../../Modal/modalTypes";
import actionsCMS from "../../../connectors/actionsCMS";
import { renderInvoiceStatus } from "../../../helpers";
import ButtonWithLoadingIcon from "../ButtonWithLoadingIcon";
import {
  INVOICE_STATUS_UNREVIEWED,
  INVOICE_STATUS_APPROVED,
  RECORD_TYPE_INVOICE,
  INVOICE_STATUS_REJECTED
} from "../../../constants";

const ThingLinkInvoice = ({
  id,
  title,
  author,
  authorid,
  created_utc,
  is_self,
  selftext,
  selftext_html,
  review_status,
  Link,
  Expando,
  url,
  location,
  isAdmin,
  confirmWithModal,
  onChangeStatus,
  userCanExecuteActions,
  loggedInAsEmail,
  isApiRequestingSetProposalStatusByToken, // TODO use more generic name
  rank = 0
}) => {
  const isEditable = true; // TODO: set the proper conditions here
  const isInvoiceDetailPath = location.pathname.split("/")[1] === "invoices";
  const invoiceCanBeApproved = review_status === INVOICE_STATUS_UNREVIEWED;
  const invoiceCanBeRejected = review_status === INVOICE_STATUS_UNREVIEWED;
  const status = isApiRequestingSetProposalStatusByToken(id);
  const loadingReject = status && status === INVOICE_STATUS_REJECTED;
  const loadingApprove = status && status === INVOICE_STATUS_APPROVED;
  return (
    <div className={`thing thing-proposal id-${id} odd link`}>
      <div className="entry unvoted">
        <span
          className="title"
          style={{ display: "flex", overflow: "visible" }}
        >
          <Link className="title may-blank loggedin" href={url} tabIndex={rank}>
            {title}
          </Link>
          {isEditable && (
            <div
              style={{
                flex: "1",
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-start"
              }}
            >
              <Link
                href={`/invoices/${id}/edit`}
                className="edit-proposal right-margin-10"
                onClick={() => null}
              >
                <i className="fa fa-edit right-margin-5" />
                Edit
              </Link>
            </div>
          )}
        </span>
        <span
          style={{ display: "flex", flexDirection: "column" }}
          className="tagline"
        >
          <span className="submitted-by">
            {author && (
              <span>
                {" by "}
                <Link href={`/user/${authorid}`}>{author}</Link>
              </span>
            )}
          </span>
          <span className="submitted-by">
            {"submitted "}
            <DateTooltip createdAt={created_utc} />
          </span>
          {renderInvoiceStatus(review_status)}
          <Expando
            {...{
              expanded: isInvoiceDetailPath,
              is_self,
              selftext,
              selftext_html
            }}
          />
        </span>
        {isAdmin && (
          <ul style={{ display: "flex" }}>
            {invoiceCanBeRejected && (
              <li key="spam">
                <ButtonWithLoadingIcon
                  className={`c-btn c-btn-primary${
                    !userCanExecuteActions ? " not-active disabled" : ""
                  }`}
                  onClick={e =>
                    confirmWithModal(modalTypes.CONFIRM_ACTION_WITH_REASON, {
                      reasonPlaceholder:
                        "Please provide a reason to reject this invoice"
                    }).then(
                      ({ reason, confirm }) =>
                        confirm &&
                        onChangeStatus(
                          authorid,
                          loggedInAsEmail,
                          id,
                          INVOICE_STATUS_REJECTED,
                          reason,
                          RECORD_TYPE_INVOICE
                        )
                    ) && e.preventDefault()
                  }
                  text="Reject"
                  data-event-action="spam"
                  isLoading={loadingReject}
                />
              </li>
            )}
            {invoiceCanBeApproved && (
              <li>
                <ButtonWithLoadingIcon
                  className={`c-btn c-btn-primary${
                    !userCanExecuteActions ? " not-active disabled" : ""
                  }`}
                  onClick={e =>
                    confirmWithModal(modalTypes.CONFIRM_ACTION, {
                      message: "Are you sure you want to publish this proposal?"
                    }).then(
                      confirm =>
                        confirm &&
                        onChangeStatus(
                          authorid,
                          loggedInAsEmail,
                          id,
                          INVOICE_STATUS_APPROVED,
                          "",
                          RECORD_TYPE_INVOICE
                        )
                    ) && e.preventDefault()
                  }
                  text="approve"
                  data-event-action="approve"
                  isLoading={loadingApprove}
                />
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default actionsCMS(ThingLinkInvoice);
