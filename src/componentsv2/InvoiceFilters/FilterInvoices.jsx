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

const FilterInvoices = ({ invoices, children, filterValues }) => {
  const { date, filters } = filterValues;
  const filterByDate = useCallback(
    invoice => {
      if (!date || !date.month || !date.year) return invoice;
      return (
        invoice.input.month === date.month && invoice.input.year === date.year
      );
    },
    [date]
  );

  const filterByStatus = useCallback(
    invoice => {
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
    },
    [filters]
  );

  const filteredInvoices = invoices.filter(filterByStatus).filter(filterByDate);

  return children && children(filteredInvoices);
};

FilterInvoices.propTypes = {
  invoices: PropTypes.array,
  children: PropTypes.node.isRequired,
  filterValues: PropTypes.object.isRequired
};

FilterInvoices.defaultProps = {
  invoices: []
};

export default FilterInvoices;
