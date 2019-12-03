import React, { useCallback, useState } from "react";
import { useUserInvoices } from "./hooks";
import { Spinner } from "pi-ui";
import Invoice from "src/componentsv2/Invoice";
import { AdminInvoiceActionsProvider } from "src/containers/Invoice/Actions";
import {
  InvoiceFilterForm,
  FilterInvoices
} from "src/componentsv2/InvoiceFilters";
import HelpMessage from "src/componentsv2/HelpMessage";
import styles from "./List.module.css";

const ListUserInvoices = ({ TopBanner, PageDetails, Main }) => {
  const { loading, invoices } = useUserInvoices();
  const [filters, setFilters] = useState({});

  const renderInvoice = useCallback(
    invoice => (
      <Invoice
        key={`invoice-${invoice.censorshiprecord.token}`}
        invoice={invoice}
      />
    ),
    []
  );

  const handleFiltersChange = useCallback(
    values => {
      setFilters(values);
    },
    [setFilters]
  );

  const renderEmptyMessage = useCallback(
    filteredInvoices => {
      return (
        !filteredInvoices.length && (
          <HelpMessage>
            {invoices.length
              ? "There are no invoices matching the selected filters"
              : "You don't have any invoices yet"}
          </HelpMessage>
        )
      );
    },
    [invoices]
  );

  const renderInvoices = useCallback(invoices => invoices.map(renderInvoice), [
    renderInvoice
  ]);

  return (
    <AdminInvoiceActionsProvider>
      <TopBanner>
        <PageDetails title="My invoices">
          <InvoiceFilterForm onChange={handleFiltersChange} disableUserFilter />
        </PageDetails>
      </TopBanner>
      <Main fillScreen>
        {loading && (
          <div className={styles.spinnerWrapper}>
            <Spinner invert />
          </div>
        )}
        {!loading && filters && (
          <FilterInvoices invoices={invoices} filterValues={filters}>
            {filteredInvoices => (
              <>
                {renderInvoices(filteredInvoices)}
                {renderEmptyMessage(filteredInvoices)}
              </>
            )}
          </FilterInvoices>
        )}
      </Main>
    </AdminInvoiceActionsProvider>
  );
};

export default ListUserInvoices;
