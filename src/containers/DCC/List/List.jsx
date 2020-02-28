import React from "react";
import { useDccs } from "./hooks";
import { Spinner, Tabs, Tab } from "pi-ui";
import Dcc from "src/componentsv2/DCC";
import HelpMessage from "src/componentsv2/HelpMessage";
import styles from "./List.module.css";
import { AdminDccActionsProvider } from "src/containers/DCC/Actions";

const ListUserDccs = ({ TopBanner, PageDetails, Main }) => {
  const { loading, dccs, handleTabChange, status } = useDccs();

  const renderEmptyMessage = filteredDccs => !filteredDccs.length && (
      <HelpMessage>
        {dccs.length
          ? "There are no DCCs matching the selected filters"
          : "You don't have any DCCs yet"}
      </HelpMessage>
    );

  const renderDccs = dccs => dccs && dccs.map((dcc) =>
    <Dcc
      key={`dcc-${dcc.censorshiprecord.token}`}
      dcc={dcc}
    />
  );

  return (
    <>
      <TopBanner>
        <PageDetails title="DCCs">
          <Tabs onSelectTab={handleTabChange} activeTabIndex={status - 1}>
            <Tab label="Active"/>
            <Tab label="Approved"/>
            <Tab label="Rejected"/>
          </Tabs>
        </PageDetails>
      </TopBanner>
      <Main fillScreen>
        {loading && (
          <div className={styles.spinnerWrapper}>
            <Spinner invert />
          </div>
        )}
        {!loading && dccs && (
          <AdminDccActionsProvider>
            {renderDccs(dccs)}
            {renderEmptyMessage(dccs)}
          </AdminDccActionsProvider>
        )}
      </Main>
    </>
  );
};

export default ListUserDccs;
