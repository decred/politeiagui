import React from "react";
import { useDccs } from "./hooks";
import { Spinner, Tabs, Tab } from "pi-ui";
import Dcc from "src/components/DCC";
import HelpMessage from "src/components/HelpMessage";
import styles from "./List.module.css";
import { AdminDccActionsProvider } from "src/containers/DCC/Actions";
import isEmpty from "lodash/isEmpty";
import { presentationalStatus } from "../helpers";

const ListDccs = ({ TopBanner, PageDetails, Main }) => {
  const { loading, dccs, handleTabChange, status } = useDccs();

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
          </AdminDccActionsProvider>
        )}
        {!loading && isEmpty(dccs) && (
          <HelpMessage>
            There are no {presentationalStatus(status)} DCCs
          </HelpMessage>
        )}
      </Main>
    </>
  );
};

export default ListDccs;
