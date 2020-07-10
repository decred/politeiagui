import React, { useCallback, useState } from "react";
import { useAdminInvoices } from "./hooks";
import {
  Spinner,
  Link as UILink,
  useMediaQuery,
  Dropdown,
  DropdownItem
} from "pi-ui";
import Link from "src/components/Link";
import Invoice from "src/components/Invoice";
import { AdminInvoiceActionsProvider } from "src/containers/Invoice/Actions";
import {
  InvoiceFilterForm,
  FilterInvoices
} from "src/components/InvoiceFilters";
import HelpMessage from "src/components/HelpMessage";
import { ModalInviteContractor } from "src/containers/User/Invite";
import styles from "./List.module.css";
import { Row } from "src/components/layout";
import useModalContext from "src/hooks/utils/useModalContext";

const ActionsContent = ({ openInviteModal }) => {
  const mobile = useMediaQuery("(max-width: 560px)");

  const inviteContractorLink = (
    <UILink className="cursor-pointer" onClick={openInviteModal}>
      Invite contractor
    </UILink>
  );
  const generatePayoutsLink = (
    <Link className="cursor-pointer" to="/admin/payouts">
      Generate payouts
    </Link>
  );
  const payoutSummariesLink = (
    <Link className="cursor-pointer" to="/admin/invoicepayouts">
      Payout summaries
    </Link>
  );

  return (
    <div>
      {!mobile ? (
        <Row justify="space-between" className={styles.actionsWrapper}>
          {inviteContractorLink}
          {generatePayoutsLink}
          {payoutSummariesLink}
        </Row>
      ) : (
        <Dropdown title="Actions" className={styles.actionsWrapper}>
          <DropdownItem>{inviteContractorLink}</DropdownItem>
          <DropdownItem>{generatePayoutsLink}</DropdownItem>
          <DropdownItem>{payoutSummariesLink}</DropdownItem>
        </Dropdown>
      )}
    </div>
  );
};

const ListAdminInvoices = ({ TopBanner, PageDetails, Main }) => {
  const { loading, invoices } = useAdminInvoices();
  const [filters, setFilters] = useState({});

  const [handleOpenModal, handleCloseModal] = useModalContext();

  const handleOpenInviteContractorModal = () => {
    handleOpenModal(ModalInviteContractor, {
      onClose: handleCloseModal
    });
  };
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
      localStorage.setItem("invoiceFiltersAdmin", JSON.stringify(values));
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
              : "There are no invoices submitted yet"}
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
          title="Admin"
          actionsContent={
            <ActionsContent openInviteModal={handleOpenInviteContractorModal} />
          }>
          <InvoiceFilterForm onChange={handleFiltersChange} isAdminPage />
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

export default ListAdminInvoices;
