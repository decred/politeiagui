import React from "react";
import { useUserInvoices } from "./hooks";

const ListUserInvoices = ({ TopBanner, PageDetails, Sidebar, Main }) => {
  const { loading, invoices } = useUserInvoices();
  console.log(invoices);
  return (
    <>
      <TopBanner>
        <PageDetails title="My invoices"></PageDetails>
      </TopBanner>
      <Sidebar />
      <Main>
        {/* <PublicActionsProvider>
            {isLoadingTokenInventory ? 
              <div className={styles.spinnerWrapper}>
                <Spinner invert />
              </div>
            :
              proposalsTokens && !isLoading && content
            }
          </PublicActionsProvider> */}
      </Main>
    </>
  );
};

export default ListUserInvoices;
