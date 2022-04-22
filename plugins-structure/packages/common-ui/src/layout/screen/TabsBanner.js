import React from "react";
import PropTypes from "prop-types";
import { Column as Col, H1, Tab, Tabs } from "pi-ui";
import styles from "./styles.module.css";

export function TabsBanner({ tabs, title, onSelectTab, activeTab }) {
  return (
    <>
      <Col xs={12}>{typeof title === "string" ? <H1>{title}</H1> : title}</Col>
      <Col xs={12} className={styles.tabs}>
        <Tabs activeTabIndex={activeTab} onSelectTab={onSelectTab}>
          {tabs.map((tab, i) => (
            <Tab key={i} tabIndex={i} label={tab} />
          ))}
        </Tabs>
      </Col>
    </>
  );
}

TabsBanner.defaultProps = {
  tabs: [],
  title: "Title",
  onSelectTab: () => {},
  activeTab: 0,
};

TabsBanner.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.node),
  title: PropTypes.node,
  onSelectTab: PropTypes.func,
  activeTab: PropTypes.number,
};
