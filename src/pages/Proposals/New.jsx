import React, { useCallback, useMemo } from "react";
import MultipleContentPage from "src/components/layout/MultipleContentPage";
import ProposalNewForm from "src/containers/Proposal/New";
import { Button } from "pi-ui";
import { useModalContext } from "src/hooks";
import { useDraftProposals } from "src/containers/Proposal/User/hooks";
import ModalDrafts from "src/components/ModalDrafts";

const DraftsButton = () => {
  const [handleOpenModal, handleCloseModal] = useModalContext();
  const { draftProposals } = useDraftProposals();

  const drafts = useMemo(
    () =>
      draftProposals
        ? Object.values(draftProposals).filter((draft) => !!draft.draftId)
        : [],
    [draftProposals]
  );

  const openDraftsModal = useCallback(() => {
    handleOpenModal(ModalDrafts, { onClose: handleCloseModal, drafts });
  }, [handleOpenModal, handleCloseModal, drafts]);

  return (
    drafts.length > 0 && (
      <Button kind="secondary" onClick={openDraftsModal}>
        Drafts
      </Button>
    )
  );
};

const PageProposalsNew = () => {
  return (
    <MultipleContentPage topBannerHeight={90}>
      {({ TopBanner, PageDetails, Main }) => (
        <>
          <TopBanner>
            <PageDetails
              title="Create Proposal"
              actionsContent={<DraftsButton />}
            />
          </TopBanner>
          <Main fillScreen>
            <ProposalNewForm />
          </Main>
        </>
      )}
    </MultipleContentPage>
  );
};

export default PageProposalsNew;
