import React from "react";
import { Link } from "pi-ui";
import { useAdminPayouts } from "./hooks";
import { AdminInvoiceActionsProvider } from "src/containers/Invoice/Actions";
import styles from "./PayoutsList.module.css";
import { Row } from "src/componentsv2/layout";

const PayoutsList = ({ TopBanner, PageDetails, Main }) => {
  const { loading, payouts } = useAdminPayouts();
  console.log(loading, payouts);
  return (
    <AdminInvoiceActionsProvider>
      <TopBanner>
        <PageDetails
          title="Payouts"
          actionsContent={
            <Row justify="space-between" className={styles.actionsWrapper}>
              <div>
                <Link className="cursor-pointer">
                  Invite contractor
                </Link>
              </div>
              <div>
                <Link className="cursor-pointer">Generate Payouts</Link>
              </div>
            </Row>
          }
        >
        </PageDetails>
      </TopBanner>
      <Main fillScreen>
      </Main>
    </AdminInvoiceActionsProvider>
  );
};

export default PayoutsList;
