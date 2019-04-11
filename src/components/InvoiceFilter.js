import React from "react";
import { withRouter } from "react-router-dom";
import qs from "query-string";
import { Tabs, Tab } from "./Tabs";
import {
  INVOICE_FILTER_ALL,
  INVOICE_STATUS_NEW,
  INVOICE_STATUS_UPDATED,
  INVOICE_STATUS_DISPUTED,
  INVOICE_STATUS_REJECTED,
  INVOICE_STATUS_APPROVED,
  INVOICE_STATUS_PAID,
  CMS_LIST_HEADER_ADMIN,
  CMS_LIST_HEADER_USER
} from "../constants";
import { setQueryStringValue } from "../lib/queryString";

const invoiceFilterOptions = [
  {
    label: "unreviewed",
    value: INVOICE_STATUS_NEW
  },
  {
    label: "updated",
    value: INVOICE_STATUS_UPDATED
  },
  {
    label: "disputed",
    value: INVOICE_STATUS_DISPUTED
  },
  {
    label: "approved",
    value: INVOICE_STATUS_APPROVED
  },
  {
    label: "paid",
    value: INVOICE_STATUS_PAID
  },
  {
    label: "rejected",
    value: INVOICE_STATUS_REJECTED
  },
  {
    label: "all invoices",
    value: INVOICE_FILTER_ALL
  }
];

const mapHeaderToOptions = {
  [CMS_LIST_HEADER_ADMIN]: invoiceFilterOptions,
  [CMS_LIST_HEADER_USER]: invoiceFilterOptions
};

const mapHeaderToCount = {
  [CMS_LIST_HEADER_ADMIN]: (invoiceCounts, status) =>
    invoiceCounts[status] || 0,
  [CMS_LIST_HEADER_USER]: (invoiceCounts, status) => invoiceCounts[status] || 0
};

class InvoiceFilter extends React.Component {
  constructor(props) {
    super(props);
    this.handleUpdateFilterValueForQueryValue(props);
  }
  componentDidMount() {
    const { filterValue, header } = this.props;
    const filterOptions = mapHeaderToOptions[header] || [];
    const validFilterOption = filterOptions.find(
      op => op && op.value === filterValue
    );
    // if the filter option set is not valid for the current available
    // filter options, set the first valid option.
    if (filterOptions.length && !validFilterOption) {
      this.props.handleChangeFilterValue(filterOptions[0].value);
    }
  }
  componentDidUpdate(prevProps) {
    this.handleUpdateQueryForFilterValueChange(prevProps);
  }
  handleUpdateFilterValueForQueryValue = props => {
    const { location, header, handleChangeFilterValue } = props;
    const { tab } = qs.parse(location.search);
    const tabOptions = mapHeaderToOptions[header];
    if (!tabOptions) return;

    const validTabOption = tabOptions.find(op => op.label === tab);
    if (validTabOption) {
      handleChangeFilterValue(validTabOption.value);
    }
  };
  handleUpdateQueryForFilterValueChange = prevProps => {
    const { header } = this.props;
    const filterValueTabHasChanged =
      prevProps.filterValue !== this.props.filterValue;
    const tabOptions = mapHeaderToOptions[header];
    if (!tabOptions) return;

    const selectedOption =
      tabOptions && tabOptions.find(op => op.value === this.props.filterValue);
    const optionLabel = selectedOption && selectedOption.label;

    if (filterValueTabHasChanged) {
      setQueryStringValue("tab", optionLabel);
    }
  };
  render() {
    const {
      handleChangeFilterValue,
      header,
      filterValue,
      invoiceCounts
    } = this.props;
    return mapHeaderToOptions[header] ? (
      <Tabs>
        {mapHeaderToOptions[header].map(op => (
          <Tab
            key={op.value}
            title={op.label}
            count={mapHeaderToCount[header](invoiceCounts, op.value)}
            selected={filterValue === op.value}
            onTabChange={() => handleChangeFilterValue(op.value)}
          />
        ))}
      </Tabs>
    ) : null;
  }
}

export default withRouter(InvoiceFilter);
