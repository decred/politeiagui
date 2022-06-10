import React, { useEffect, useState } from "react";
import { Spinner, BoxTextInput, Message, Table, Card } from "pi-ui";
import { useProposalBillingSummary } from "./hooks";
import styles from "./ProposalBillingSummary.module.css";
import { formatCentsToUSD } from "src/utils";
import Link from "src/components/Link";

const TABLE_HEADERS = ["Proposal", "Amount"];

const ProposalBillingSummary = ({ TopBanner, PageDetails, Main }) => {
  const [error, setError] = useState();
  const { getSpendingSummary, proposalsBilled, loading } =
    useProposalBillingSummary();
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
          <Card paddingSize="small" className={styles.card}>
            <Table
              className={styles.table}
              data={proposals.map(({ token, title, totalbilled }) => ({
                Proposal: (
                  <Link
                    to={`/admin/proposalsbilling/${token}`}
                    className={styles.titleLink}
                  >
                    {title}
                  </Link>
                ),
                Amount: formatCentsToUSD(totalbilled)
              }))}
              headers={TABLE_HEADERS}
            />
          </Card>
        )}
      </Main>
    </>
  );
};

export default ProposalBillingSummary;
