import React, { useEffect, useState } from "react";
import { Spinner, Card, H2, BoxTextInput, Message } from "pi-ui";
import { useProposalBillingSummary } from "./hooks";
import styles from "./ProposalBillingSummary.module.css";
import { formatCentsToUSD } from "src/utils";
import Link from "src/components/Link";

const ProposalBillingSummary = ({ TopBanner, PageDetails, Main }) => {
  const [error, setError] = useState();
  const {
    getSpendingSummary,
    proposalsBilled,
    loading
  } = useProposalBillingSummary();
  const [proposals, setProposals] = useState(proposalsBilled);
  useEffect(() => {
    !proposalsBilled && getSpendingSummary().catch((e) => setError(e));
  }, [getSpendingSummary, proposalsBilled]);

  useEffect(() => {
    setProposals(proposalsBilled);
  }, [proposalsBilled]);

  const [searchString, setSearchString] = useState("");

  const handleSearchChange = (e) => setSearchString(e.target.value);
  const handleSubmit = () => {
    const stringRegex = new RegExp(searchString, "i");
    const newProposals = proposalsBilled.filter((proposal) =>
      proposal.title.match(stringRegex)
    );
    setProposals(newProposals);
  };
  return (
    <>
      <TopBanner>
        <PageDetails
          title="Proposal Billing"
          actionsClassName={styles.searchWrapper}
          actionsContent={
            <div>
              <BoxTextInput
                searchInput={true}
                rounded={true}
                onChange={handleSearchChange}
                onSubmit={handleSubmit}
                value={searchString}
                placeholder="Proposal name"
                name="search"
              />
            </div>
          }
        />
      </TopBanner>
      <Main fillScreen>
        {error ? (
          <Message kind="error">{error.toString()}</Message>
        ) : loading || !proposals ? (
          <div className={styles.spinnerWrapper}>
            <Spinner invert />
          </div>
        ) : (
          proposals.map(({ token, title, totalbilled }) => {
            return (
              <Card paddingSize="small" className={styles.card} key={token}>
                <div className={styles.title}>
                  <Link
                    to={`/admin/proposalsbilling/${token}`}
                    className={styles.titleLink}>
                    <H2>{title}</H2>
                  </Link>
                </div>
                <div className={styles.billed}>
                  <H2>{formatCentsToUSD(totalbilled)}</H2>
                </div>
              </Card>
            );
          })
        )}
      </Main>
    </>
  );
};

export default ProposalBillingSummary;
