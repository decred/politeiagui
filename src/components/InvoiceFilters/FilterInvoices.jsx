import { useCallback } from "react";
import PropTypes from "prop-types";
import {
  INVOICE_STATUS_NEW,
  INVOICE_STATUS_UPDATED,
  INVOICE_STATUS_DISPUTED,
  INVOICE_STATUS_REJECTED,
  INVOICE_STATUS_APPROVED,
  INVOICE_STATUS_PAID
} from "src/containers/Invoice";
import flow from "lodash/fp/flow";
import filter from "lodash/fp/filter";

const FilterInvoices = ({ invoices, children, filterValues }) => {
  const { date, filters, users } = filterValues;
  const filterByDate = useCallback(
    filter((invoice) => {
      if (!date || !date.month || !date.year) return invoice;
      if (date.month === "all") return invoice.input.year === date.year;
      return (
        invoice.input.month === date.month && invoice.input.year === date.year
      );
    }),
    [date]
  );

  const filterByRange = useCallback(
    filter((invoice) => {
      if (!date) return invoice;
      if (!(date.length && date.length > 1)) return invoice;
      const [firstDateSelected, secondDateSelected] = date;
      if (!firstDateSelected || !secondDateSelected) return invoices;
      const first = new Date(
        firstDateSelected.year,
        firstDateSelected.month
      ).getTime();
      const second = new Date(
        secondDateSelected.year,
        secondDateSelected.month
      ).getTime();
      const invoiceDate = new Date(
        invoice.input.year,
        invoice.input.month
      ).getTime();

      return invoiceDate >= first && invoiceDate <= second;
    }),
    [date]
  );

  const filterByUserID = useCallback(
    filter((invoice) =>
      !users || !users.length
        ? invoice
        : users.find((user) => user.value === invoice.userid)
    ),
    [users]
  );

  const filterByStatus = useCallback(
    filter((invoice) => {
      if (!filters || filters.all) return true;

      switch (invoice.status) {
        case INVOICE_STATUS_NEW:
        case INVOICE_STATUS_UPDATED:
          return filters.unreviewed;
        case INVOICE_STATUS_DISPUTED:
          return filters.disputed;
        case INVOICE_STATUS_APPROVED:
          return filters.approved;
        case INVOICE_STATUS_REJECTED:
          return filters.rejected;
        case INVOICE_STATUS_PAID:
          return filters.paid;
        default:
          return false;
      }
    }),
    [filters]
  );

  const filteredInvoices = flow(
    filterByStatus,
    filterByDate,
    filterByRange,
    filterByUserID
  )(invoices);

  return children && children(filteredInvoices);
};

FilterInvoices.propTypes = {
  invoices: PropTypes.array,
  children: PropTypes.func.isRequired,
  filterValues: PropTypes.object.isRequired
};

FilterInvoices.defaultProps = {
  invoices: []
};

export default FilterInvoices;
