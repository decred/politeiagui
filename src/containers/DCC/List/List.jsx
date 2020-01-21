import React, { useCallback } from "react";
import { useDccs } from "./hooks";
import { Spinner, Tabs, Tab } from "pi-ui";
import NewButton from "src/componentsv2/NewButton";
import Dcc from "src/componentsv2/DCC";
// import { AdminDccActionsProvider } from "src/containers/DCC/Actions";
import HelpMessage from "src/componentsv2/HelpMessage";
import styles from "./List.module.css";

const NewDccButton = () => <NewButton label="New DCC" goTo="/dccs/new" />;

const ListUserDccs = ({ TopBanner, PageDetails, Main }) => {
  const { loading, dccs, handleTabChange, status } = useDccs();

  const renderDcc = useCallback(
    dcc => (
      <Dcc
        key={`dcc-${dcc.censorshiprecord.token}`}
        dcc={dcc}
      />
    ),
    []
  );

  const renderEmptyMessage = useCallback(
    filteredDccs => {
      return (
        !filteredDccs.length && (
          <HelpMessage>
            {dccs.length
              ? "There are no DCCs matching the selected filters"
              : "You don't have any DCCs yet"}
          </HelpMessage>
        )
      );
    },
    [dccs]
  );

  const renderDccs = useCallback(dccs => dccs && dccs.map(renderDcc), [
    renderDcc
  ]);

  return (
    <>
      <TopBanner>
        <PageDetails title="DCCs" actionsContent={<NewDccButton/>}>
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
          <>
            {renderDccs(dccs)}
            {renderEmptyMessage(dccs)}
          </>
        )}
      </Main>
    </>
  );
};

export default ListUserDccs;
