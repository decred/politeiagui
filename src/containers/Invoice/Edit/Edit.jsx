import React from "react";
import get from "lodash/fp/get";
import { withRouter } from "react-router-dom";
import { Card } from "pi-ui";
import { useInvoice } from "../Detail/hooks";
import { useEditInvoice } from "./hooks";
import { fromUSDCentsToUSDUnits } from "src/helpers";
import InvoiceLoader from "src/componentsv2/Invoice/InvoiceLoader";
import InvoiceForm from "src/componentsv2/InvoiceForm";

const EditInvoice = ({ match }) => {
  const tokenFromUrl = get("params.token", match);
  const { invoice, loading } = useInvoice(tokenFromUrl);
  const { onEditInvoice } = useEditInvoice();

  const initialValues = invoice ?
    {
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
      files: invoice.input.files,
      lineitems: invoice.input.lineitems
    } : null;

  return (
    <Card className="container margin-bottom-l">
      {!loading && !!invoice ? 
          <InvoiceForm initialValues={initialValues} onSubmit={onEditInvoice} />
        :
          <InvoiceLoader extended />
      }
    </Card>
  );
};

export default withRouter(EditInvoice);

