import React from "react";
import PropTypes from "prop-types";
import { Button, useMediaQuery } from "pi-ui";
import MultipleContentPage from "src/components/layout/MultipleContentPage";
import EditInvoice from "src/containers/Invoice/Edit";

const PageInvoiceEdit = ({ history, match }) => {
  const mobile = useMediaQuery("(max-width: 560px)");

  const CancelButton = () => (
    <Button
      type="button"
      kind="secondary"
      size={mobile ? "sm" : "md"}
      onClick={() => history.push(`/invoices/${match.params.token}`)}
    >
      Cancel
    </Button>
  );

  return (
    <MultipleContentPage topBannerHeight={90}>
      {({ TopBanner, PageDetails, Main }) => (
        <>
          <TopBanner>
            <PageDetails
              title="Edit Invoice"
              actionsContent={<CancelButton />}
            />
          </TopBanner>
          <Main fillScreen>
            <EditInvoice />
          </Main>
        </>
      )}
    </MultipleContentPage>
  );
};

PageInvoiceEdit.propTypes = {
  history: PropTypes.object,
  match: PropTypes.object
};

export default PageInvoiceEdit;
