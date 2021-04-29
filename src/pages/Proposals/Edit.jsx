import React from "react";
import { Button, useMediaQuery } from "pi-ui";
import { withRouter } from "react-router-dom";
import MultipleContentPage from "src/components/layout/MultipleContentPage";
import ProposalEdit from "src/containers/Proposal/Edit";

const PageProposalEdit = ({ history, match }) => {
  const mobile = useMediaQuery("(max-width: 560px)");

  const CancelButton = () => (
    <Button
      type="button"
      kind="secondary"
      size={mobile ? "sm" : "md"}
      onClick={() => history.push(`/record/${match.params.token}`)}>
      Cancel
    </Button>
  );

  return (
    <MultipleContentPage topBannerHeight={90}>
      {({ TopBanner, PageDetails, Main }) => (
        <>
          <TopBanner>
            <PageDetails
              title="Edit Proposal"
              actionsContent={<CancelButton />}
            />
          </TopBanner>
          <Main fillScreen>
            <ProposalEdit />
          </Main>
        </>
      )}
    </MultipleContentPage>
  );
};

export default withRouter(PageProposalEdit);
