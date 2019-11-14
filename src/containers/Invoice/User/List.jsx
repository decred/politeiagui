import React, { useCallback, useState } from "react";
import { useUserInvoices } from "./hooks";
import Invoice from "src/componentsv2/Invoice";
import {
  InvoiceFilterForm,
  FilterInvoices
} from "src/componentsv2/InvoiceFilters";

const ListUserInvoices = ({ TopBanner, PageDetails, Sidebar, Main }) => {
  const { loading, invoices } = useUserInvoices();
  const [filters, setFilters] = useState({});

  const renderInvoice = useCallback(
    invoice => <Invoice invoice={invoice} />,
    []
  );

  const handleFiltersChange = useCallback(
    values => {
      setFilters(values);
    },
    [setFilters]
  );

  return (
    <>
      <TopBanner>
        <PageDetails title="My invoices">
          <InvoiceFilterForm onChange={handleFiltersChange} />
        </PageDetails>
      </TopBanner>
      <Main fillScreen>
        <FilterInvoices invoices={invoices} filterValues={filters}>
          {filteredInvoices => filteredInvoices.map(renderInvoice)}
        </FilterInvoices>
      </Main>
    </>
  );
};

export default ListUserInvoices;
