import React, { useCallback, useState } from "react";
// import Link from "src/componentsv2/Link";
import { useAdminInvoices } from "./hooks";
import useBooleanState from "src/hooks/utils/useBooleanState";
import { Spinner, Link } from "pi-ui";
import Invoice from "src/componentsv2/Invoice";
import { AdminInvoiceActionsProvider } from "src/containers/Invoice/Actions";
import {
  InvoiceFilterForm,
  FilterInvoices
} from "src/componentsv2/InvoiceFilters";
import HelpMessage from "src/componentsv2/HelpMessage";
import { ModalInviteContractor } from "src/containers/User/Invite";
import styles from "./List.module.css";

const ListAdminInvoices = ({ TopBanner, PageDetails, Main }) => {
  const { loading, invoices } = useAdminInvoices();
  const [filters, setFilters] = useState({});
  const [showInviteModal, openInviteModal, closeInviteModal] = useBooleanState(
    false
  );

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
              : "There are no invoices submitted yet"}
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
        <PageDetails
          title="Admin"
          actionsContent={
            <div>
              <Link className="cursor-pointer" onClick={openInviteModal}>
                Invite contractor
              </Link>
            </div>
          }
        >
          <InvoiceFilterForm onChange={handleFiltersChange} />
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
      <ModalInviteContractor
        show={showInviteModal}
        onClose={closeInviteModal}
      />
    </AdminInvoiceActionsProvider>
  );
};

export default ListAdminInvoices;
