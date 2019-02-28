import React from "react";
import { withRouter } from "react-router-dom";
import qs from "query-string";
import { Tabs, Tab } from "./Tabs";
import {
  INVOICE_FILTER_ALL,
  INVOICE_STATUS_NEW,
  INVOICE_STATUS_UPDATED,
  INVOICE_STATUS_REJECTED,
  INVOICE_STATUS_APPROVED,
  INVOICE_STATUS_PAID,
  INVOICE_USER_FILTER_DRAFT,
  INVOICE_USER_FILTER_UNREVIEWED,
  INVOICE_USER_FILTER_UPDATED,
  INVOICE_USER_FILTER_REJECTED,
  INVOICE_USER_FILTER_APPROVED,
  INVOICE_USER_FILTER_PAID,
  CMS_LIST_HEADER_ADMIN,
  CMS_LIST_HEADER_USER
} from "../constants";
import { setQueryStringWithoutPageReload } from "../helpers";

const adminFilterOptions = [
  {
    label: "unreviewed",
    value: INVOICE_STATUS_NEW
  },
  {
    label: "updated",
    value: INVOICE_STATUS_UPDATED
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
const userFilterOptions = [
  {
    label: "drafts",
    value: INVOICE_USER_FILTER_DRAFT
  },
  {
    label: "unreviewed",
    value: INVOICE_USER_FILTER_UNREVIEWED
  },
  {
    label: "updated",
    value: INVOICE_USER_FILTER_UPDATED
  },
  {
    label: "approved",
    value: INVOICE_USER_FILTER_APPROVED
  },
  {
    label: "rejected",
    value: INVOICE_USER_FILTER_REJECTED
  },
  {
    label: "paid",
    value: INVOICE_USER_FILTER_PAID
  }
];
const mapHeaderToOptions = {
  [CMS_LIST_HEADER_ADMIN]: adminFilterOptions,
  [CMS_LIST_HEADER_USER]: userFilterOptions
};

const mapHeaderToCount = {
  [CMS_LIST_HEADER_ADMIN]: (invoiceCounts, status) => {
    // unreviewed invoices and invoices with unreviewed changes are shown on the same list
    // so is necessary to sum their counts
    const count = invoiceCounts[status] || 0;
    if (status === INVOICE_STATUS_NEW) {
      return count + (invoiceCounts[INVOICE_STATUS_UPDATED] || 0);
    }
    return count;
  },
  [CMS_LIST_HEADER_USER]: (invoiceCounts, status) => invoiceCounts[status] || 0
};

class InvoiceFilter extends React.Component {
  constructor(props) {
    super(props);
    this.handleUpdateFilterValueForQueryValue(props);
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
    const optionLabel = selectedOption.label;

    if (filterValueTabHasChanged) {
      setQueryStringWithoutPageReload(`?tab=${optionLabel}`);
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
