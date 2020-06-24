import React, { useEffect } from "react";
import { Spinner, Card, H2 } from "pi-ui";
import { useProposalBillingSummary } from "./hooks";
import styles from "./ProposalBillingSummary.module.css";
import { formatCentsToUSD } from "src/utils";
import Link from "src/components/Link";

const ProposalBillingSummary = ({ TopBanner, PageDetails, Main }) => {
  const {
    getSpendingSummary,
    proposalsBilled,
    loading
  } = useProposalBillingSummary();
  useEffect(() => {
    getSpendingSummary();
  }, [getSpendingSummary]);
  return (
    <>
      <TopBanner>
        <PageDetails title="Proposal Billing" actionsContent={null} />
      </TopBanner>
      <Main fillScreen>
        {loading && !proposalsBilled && (
          <div className={styles.spinnerWrapper}>
            <Spinner invert />
          </div>
        )}
        {proposalsBilled &&
          proposalsBilled.map(({ token, title, totalbilled }) => {
            return (
              <Card paddingSize="small" className={styles.card} key={token}>
                <div className={styles.title}>
                  <Link
                    to={`/admin/proposalsbilling/${token}`}
                    className={styles.titleLink}>
                    <H2>{title || "Awesome prop Title Mock"}</H2>
                  </Link>
                </div>
                <div className={styles.billed}>
                  <H2>{formatCentsToUSD(totalbilled)}</H2>
                </div>
              </Card>
            );
          })}
      </Main>
    </>
  );
};

export default ProposalBillingSummary;
