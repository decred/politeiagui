import React from "react";
import { DateTooltip } from "snew-classic-ui";
import * as modalTypes from "../../Modal/modalTypes";
import actionsCMS from "../../../connectors/actionsCMS";
import { renderInvoiceStatus } from "../../../helpers";
import ButtonWithLoadingIcon from "../ButtonWithLoadingIcon";
import ProposalImages from "../../ProposalImages";
import {
  INVOICE_STATUS_UNREVIEWED,
  INVOICE_STATUS_APPROVED,
  INVOICE_STATUS_UPDATED,
  RECORD_TYPE_INVOICE,
  INVOICE_STATUS_REJECTED,
  INVOICE_STATUS_DISPUTED
} from "../../../constants";
import InvoiceContent from "../../InvoiceContent";

const ThingLinkInvoice = ({
  id,
  title,
  author,
  authorid,
  userId,
  created_utc,
  input,
  review_status,
  otherFiles,
  version,
  Link,
  url,
  location,
  isAdmin,
  confirmWithModal,
  onChangeStatus,
  userCanExecuteActions,
  loggedInAsEmail,
  isApiRequestingSetInvoiceStatusByToken,
  rank = 0
}) => {
  const isEditable =
    authorid === userId &&
    (review_status === INVOICE_STATUS_UNREVIEWED ||
      review_status === INVOICE_STATUS_DISPUTED ||
      review_status === INVOICE_STATUS_UPDATED);
  const isInvoiceDetailPath = location.pathname.split("/")[1] === "invoices";

  const invoiceMissingVerdict =
    review_status === INVOICE_STATUS_UNREVIEWED ||
    review_status === INVOICE_STATUS_UPDATED;

  const status = isApiRequestingSetInvoiceStatusByToken(id);
  const loadingReject = status === INVOICE_STATUS_REJECTED;
  const loadingApprove = status === INVOICE_STATUS_APPROVED;
  const loadingDispute = status === INVOICE_STATUS_DISPUTED;
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

          {input && (
            <InvoiceContent expanded={isInvoiceDetailPath} {...input} />
          )}

          {otherFiles && <ProposalImages readOnly files={otherFiles} />}
        </span>
        {isAdmin && (
          <ul style={{ display: "flex" }}>
            {invoiceMissingVerdict && (
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
                          version,
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
            {invoiceMissingVerdict && (
              <li>
                <ButtonWithLoadingIcon
                  className={`c-btn c-btn-primary${
                    !userCanExecuteActions ? " not-active disabled" : ""
                  }`}
                  onClick={e =>
                    confirmWithModal(modalTypes.CONFIRM_ACTION, {
                      message: "Are you sure you want to approve this invoice?"
                    }).then(
                      confirm =>
                        confirm &&
                        onChangeStatus(
                          authorid,
                          loggedInAsEmail,
                          id,
                          INVOICE_STATUS_APPROVED,
                          version,
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
            {invoiceMissingVerdict && (
              <li>
                <ButtonWithLoadingIcon
                  className={`c-btn c-btn-primary${
                    !userCanExecuteActions ? " not-active disabled" : ""
                  }`}
                  onClick={e =>
                    confirmWithModal(modalTypes.CONFIRM_ACTION, {
                      message: "Are you sure you want to dispute this invoice?"
                    }).then(
                      confirm =>
                        confirm &&
                        onChangeStatus(
                          authorid,
                          loggedInAsEmail,
                          id,
                          INVOICE_STATUS_DISPUTED,
                          version,
                          "",
                          RECORD_TYPE_INVOICE
                        )
                    ) && e.preventDefault()
                  }
                  text="dispute"
                  data-event-action="dispute"
                  isLoading={loadingDispute}
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
