import React, { useEffect } from "react";
import PropTypes from "prop-types";
import get from "lodash/fp/get";
import homeCMSConnector from "../../connectors/homeCMS";
import { PageLoadingIcon } from "../snew";
import Message from "../Message";
import { INVOICE_STATUS_NEW } from "../../constants";
import Reminder, { ReminderList } from "./Reminder";

const getCurrentMonth = () => {
  const d = new Date();
  return d.getMonth() + 1;
};

const getCurrentYear = () => {
  const d = new Date();
  return d.getFullYear();
};

const invoiceYear = get(["input", "year"]);
const invoiceMonth = get(["input", "month"]);

const UserReminders = ({ invoices }) => {
  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();
  const hasSubmittedInvoiceInTheCurrentYearAndMonth = invoices.find(
    inv =>
      invoiceYear(inv) === currentYear && invoiceMonth(inv) === currentMonth
  );

  return (
    <>
      <Reminder
        done={!!hasSubmittedInvoiceInTheCurrentYearAndMonth}
        text={"You have not yet submitted your invoice for this month."}
        doneText={"You already submmited an invoice for this month."}
        actionText={"Submit now"}
        actionLink={"invoices/new"}
        isAdmin={false}
      />
    </>
  );
};

const AdminReminders = ({ invoices }) => {
  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();

  const invoicesWaitingForReview = invoices.filter(
    inv => inv.status === INVOICE_STATUS_NEW
  );
  const newInvoicesForThisMonth = invoices.filter(
    inv =>
      invoiceYear(inv) === currentYear && invoiceMonth(inv) === currentMonth
  );
  const newInvoicesUnreviewed = newInvoicesForThisMonth.filter(
    inv => inv.status === INVOICE_STATUS_NEW
  );

  return (
    <>
      <Reminder
        isAdmin={true}
        done={!invoicesWaitingForReview.length}
        text={`There are ${
          invoicesWaitingForReview.length
        } invoices with pending review.`}
        doneText={"All invoices are reviewed."}
        actionText={"Review"}
        actionLink={"admin/?tab=unreviewed"}
      />
      <Reminder
        isAdmin={true}
        done={!newInvoicesUnreviewed.length}
        text={`${newInvoicesForThisMonth.length} invoices this month. ${
          newInvoicesUnreviewed.length
        } with pending review.`}
        doneText={`${
          newInvoicesForThisMonth.length
        } invoices this month. All reviewed.`}
        actionText={"Review"}
        actionLink={`admin/?month=${currentMonth}&year=${currentYear}`}
      />
    </>
  );
};

const HomeCMS = ({
  userid,
  onFetchUserInvoices,
  onFetchAdminInvoices,
  isAdmin,
  error,
  isLoading,
  userInvoices,
  adminInvoices
}) => {
  const fetchUserInvoices = () => {
    if (userid) {
      onFetchUserInvoices(userid);
      if (isAdmin) {
        onFetchAdminInvoices();
      }
    }
  };

  useEffect(fetchUserInvoices, [userid]);

  return (
    <div className="content">
      <h1 className="content-title">Contractor Mangament System</h1>
      {isLoading ? (
        <PageLoadingIcon />
      ) : error ? (
        <Message header="Error fetching invoices" type={"error"} body={error} />
      ) : (
        <div style={{ paddingLeft: "24px" }}>
          <ReminderList title={"Reminders"}>
            <UserReminders invoices={userInvoices} />
            {isAdmin && <AdminReminders invoices={adminInvoices} />}
          </ReminderList>
        </div>
      )}
    </div>
  );
};

HomeCMS.defaultProps = {
  userInvoices: [],
  adminInvoices: []
};

HomeCMS.propTypes = {
  userid: PropTypes.string,
  onFetchUserInvoices: PropTypes.func,
  onFetchAdminInvoices: PropTypes.func,
  isAdmin: PropTypes.bool,
  error: PropTypes.any,
  isLoading: PropTypes.bool,
  userInvoices: PropTypes.array,
  adminInvoices: PropTypes.array
};

export default homeCMSConnector(HomeCMS);
