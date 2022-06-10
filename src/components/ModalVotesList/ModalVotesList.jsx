import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Tabs, Tab, Card } from "pi-ui";
import Link from "src/components/Link";
import styles from "./ModalVotesList.module.css";

const VotesList = ({ options, currentID }) => (
  <div className={styles.list}>
    {options.length ? (
      options.map((op) => (
        <Card
          key={op.value}
          marker={op.value === currentID}
          className={styles.card}
        >
          <Link to={`/user/${op.value}`}>{op.label}</Link>
        </Card>
      ))
    ) : (
      <Card>No votes yet</Card>
    )}
  </div>
);

const ModalVotesList = ({
  supportList,
  againstList,
  neutralList,
  show,
  onClose,
  currentID
}) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  return (
    <Modal onClose={onClose} show={show}>
      <Tabs onSelectTab={setActiveTabIndex} activeTabIndex={activeTabIndex}>
        <Tab label="support" count={supportList.length}>
          <VotesList options={supportList} currentID={currentID} />
        </Tab>
        <Tab label="against" count={againstList.length}>
          <VotesList options={againstList} currentID={currentID} />
        </Tab>
        {neutralList && (
          <Tab label="neutral" count={neutralList.length}>
            <VotesList options={neutralList} currentID={currentID} />
          </Tab>
        )}
      </Tabs>
    </Modal>
  );
};

const elementListShape = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
});

ModalVotesList.propTypes = {
  supportList: PropTypes.arrayOf(elementListShape),
  opposeList: PropTypes.arrayOf(elementListShape),
  neutralList: PropTypes.arrayOf(elementListShape),
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentID: PropTypes.string
};

export default ModalVotesList;
