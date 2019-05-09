import React, { useEffect } from "react";
import PropTypes from "prop-types";
import get from "lodash/fp/get";
import homeCMSConnector from "../../connectors/homeCMS";
import { PageLoadingIcon } from "../snew";
import Message from "../Message";
import { INVOICE_STATUS_NEW } from "../../constants";
import Reminder, { ReminderList } from "./Reminder";
import { getCurrentMonth, getCurrentYear } from "../../helpers";

const invoiceYear = get(["input", "year"]);
const invoiceMonth = get(["input", "month"]);

const getPreviousMonthAndYear = () => {
  const currentMonth = getCurrentMonth();
  const currentYear = getCurrentYear();
  const month = currentMonth === 1 ? 12 : currentMonth - 1;
  const year = currentMonth === 1 ? currentYear - 1 : currentYear;
  return { month, year };
};

const UserReminders = ({ invoices }) => {
  const { month, year } = getPreviousMonthAndYear();
  const hasSubmittedInvoiceInTheCurrentYearAndMonth = invoices.find(
    inv => invoiceYear(inv) === year && invoiceMonth(inv) === month
  );

  return (
    <>
      <Reminder
        done={!!hasSubmittedInvoiceInTheCurrentYearAndMonth}
        text={"You have not yet submitted your invoice for the previous month."}
        doneText={"You already submmited an invoice for the previous month."}
        actionText={"Submit now"}
        actionLink={"invoices/new"}
        isAdmin={false}
      />
    </>
  );
};

const AdminReminders = ({ invoices }) => {
  const { month, year } = getPreviousMonthAndYear();

  const invoicesWaitingForReview = invoices.filter(
    inv => inv.status === INVOICE_STATUS_NEW
  );
  const newInvoicesForThePreviousMonth = invoices.filter(
    inv => invoiceYear(inv) === year && invoiceMonth(inv) === month
  );
  const newInvoicesUnreviewed = newInvoicesForThePreviousMonth.filter(
    inv => inv.status === INVOICE_STATUS_NEW
  );

  return (
    <>
      <Reminder
        isAdmin={true}
        done={!invoicesWaitingForReview.length}
        text={`${
          invoicesWaitingForReview.length
        } invoice(s) with pending review.`}
        doneText={"All invoices are reviewed."}
        actionText={"Review"}
        actionLink={"admin/?tab=unreviewed"}
      />
      <Reminder
        isAdmin={true}
        done={!newInvoicesUnreviewed.length}
        text={`${
          newInvoicesForThePreviousMonth.length
        } invoice(s) int the previous month. ${
          newInvoicesUnreviewed.length
        } with pending review.`}
        doneText={`${
          newInvoicesForThePreviousMonth.length
        } invoice(s) in the previous month. All reviewed.`}
        actionText={"Review"}
        actionLink={`admin/?month=${month}&year=${year}`}
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
      <h1 className="content-title">Contractor Management System</h1>
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
