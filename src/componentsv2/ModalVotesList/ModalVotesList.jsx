import React, { useState } from "react";
import { Modal, Tabs, Tab, Card } from "pi-ui";
import Link from "src/componentsv2/Link";
import styles from "./ModalVotesList.module.css";

const VotesList = ({ options, currentID }) =>
  options.length
    ? options.map(op => (
      <Card key={op.value} marker={op.value === currentID} className={styles.list}>
        <Link to={`/user/${op.value}`} >{op.label}</Link>
      </Card>
    ))
    : <Card>No votes yet</Card>;

const ModalVotesList = ({ supportList, againstList, neutralList, show, onClose, currentID }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  return (
    <Modal
      onClose={onClose}
      show={show}
    >
      <Tabs onSelectTab={setActiveTabIndex} activeTabIndex={activeTabIndex}>
        <Tab label="support" count={supportList.length}>
          <VotesList options={supportList} currentID={currentID}/>
        </Tab>
        <Tab label="against" count={againstList.length}>
          <VotesList options={againstList} currentID={currentID}/>
        </Tab>
        {neutralList && (
          <Tab label="neutral" count={neutralList.length}>
            <VotesList options={neutralList} currentID={currentID}/>
          </Tab>
        )}
      </Tabs>
    </Modal>
  );
};

export default ModalVotesList;
