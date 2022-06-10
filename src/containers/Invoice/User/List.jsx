import React, { useCallback, useState } from "react";
import { useUserInvoices } from "./hooks";
import { Spinner, Message } from "pi-ui";
import Invoice from "src/components/Invoice";
import Link from "src/components/Link";
import { AdminInvoiceActionsProvider } from "src/containers/Invoice/Actions";
import {
  InvoiceFilterForm,
  FilterInvoices
} from "src/components/InvoiceFilters";
import HelpMessage from "src/components/HelpMessage";
import useContractor from "src/containers/User/Detail/hooks/useContractor";
import styles from "./List.module.css";

const ListUserInvoices = ({
  TopBanner,
  PageDetails,
  Main,
  DefaultNewButton
}) => {
  const { loading, invoices } = useUserInvoices();
  const { requireGitHubName, user } = useContractor();
  const [filters, setFilters] = useState({});

  const renderInvoice = useCallback(
    (invoice) => (
      <Invoice
        key={`invoice-${invoice.censorshiprecord.token}`}
        invoice={invoice}
      />
    ),
    []
  );

  const handleFiltersChange = useCallback(
    (values) => {
      setFilters(values);
    },
    [setFilters]
  );

  const renderEmptyMessage = useCallback(
    (filteredInvoices) => {
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

  const renderInvoices = useCallback(
    (invoices) => invoices.map(renderInvoice),
    [renderInvoice]
  );

  return (
    <AdminInvoiceActionsProvider>
      <TopBanner>
        <PageDetails
          title="My Invoices"
          actionsContent={
            <>
              {user && user.proposalsowned && user.proposalsowned.length > 0 && (
                <Link
                  className="cursor-pointer"
                  to={`/user/${user.userid}?tab=proposals owned`}
                >
                  Proposals owned
                </Link>
              )}
              <DefaultNewButton />
            </>
          }
        >
          <InvoiceFilterForm onChange={handleFiltersChange} disableUserFilter />
        </PageDetails>
      </TopBanner>
      <Main fillScreen>
        {requireGitHubName && (
          <Message kind="warning" className="margin-bottom-m">
            Update your GitHub Username information on Account > Manage
            Contractor
          </Message>
        )}
        {loading && (
          <div className={styles.spinnerWrapper}>
            <Spinner invert />
          </div>
        )}
        {!loading && filters && (
          <FilterInvoices invoices={invoices} filterValues={filters}>
            {(filteredInvoices) => (
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
