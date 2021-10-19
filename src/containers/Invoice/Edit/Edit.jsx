import React from "react";
import PropTypes from "prop-types";
import get from "lodash/fp/get";
import { withRouter } from "react-router-dom";
import { Card, Message } from "pi-ui";
import { useInvoice } from "../Detail/hooks";
import useApprovedProposals from "src/hooks/api/useApprovedProposals";
import { useEditInvoice } from "./hooks";
import { fromUSDCentsToUSDUnits } from "src/helpers";
import InvoiceLoader from "src/components/Invoice/InvoiceLoader";
import InvoiceForm from "src/components/InvoiceForm";
import usePolicy from "src/hooks/api/usePolicy";

const EditInvoice = ({ match }) => {
  const tokenFromUrl = get("params.token", match);
  const { onEditInvoice } = useEditInvoice();
  const { invoice, loading, error } = useInvoice(tokenFromUrl);
  const {
    policyTicketVote: { summariespagesize: proposalPageSize }
  } = usePolicy();

  const isInvoiceLoaded = !loading && !!invoice;

  const initialValues = invoice
    ? {
        token: tokenFromUrl,
        name: invoice.input.contractorname,
        location: invoice.input.contractorlocation,
        contact: invoice.input.contractorcontact,
        address: invoice.input.paymentaddress,
        rate: fromUSDCentsToUSDUnits(invoice.input.contractorrate),
        date: {
          month: invoice.input.month,
          year: invoice.input.year
        },
        files: invoice.file
          ? invoice.file.filter((p) => p.name !== "invoice.json")
          : [],
        lineitems: invoice.input.lineitems
      }
    : null;

  const { proposalsNotRFP: proposals, error: proposalsError } =
    useApprovedProposals(proposalPageSize);
  return (
    <Card className="container margin-bottom-l">
      {error ? (
        <Message kind="error">{error.toString()}</Message>
      ) : isInvoiceLoaded ? (
        <InvoiceForm
          initialValues={initialValues}
          onSubmit={onEditInvoice}
          approvedProposals={proposals}
          approvedProposalsError={proposalsError}
          editMode
        />
      ) : (
        <InvoiceLoader extended />
      )}
    </Card>
  );
};

EditInvoice.propTypes = {
  match: PropTypes.object
};

export default withRouter(EditInvoice);
