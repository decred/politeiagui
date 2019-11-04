import React from "react";

const ListUserInvoices = ({ TopBanner, PageDetails, Sidebar, Main }) => {
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
