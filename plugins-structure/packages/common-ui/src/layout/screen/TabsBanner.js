import React from "react";
import PropTypes from "prop-types";
import { Column as Col, H1, Tab, Tabs } from "pi-ui";
import styles from "./styles.module.css";
import isString from "lodash/isString";

const Subtitle = ({ subtitle }) => {
  if (!subtitle) return null;
  return isString(subtitle) ? (
    <span className={styles.subtitle}>{subtitle}</span>
  ) : (
    subtitle
  );
};
const Title = ({ title }) => {
  if (!title) return null;
  return isString(title) ? <H1>{title}</H1> : title;
};

export function TabsBanner({ tabs, title, subtitle, onSelectTab, activeTab }) {
  return (
    <>
      <Col xs={12} data-testid="tabs-banner-header">
        <Title title={title} />
        <Subtitle subtitle={subtitle} />
      </Col>
      <Col xs={12} className={styles.tabs} data-testid="tabs-banner-tabs">
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
  onSelectTab: () => {},
  activeTab: 0,
};

TabsBanner.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.node),
  title: PropTypes.node,
  subtitle: PropTypes.node,
  onSelectTab: PropTypes.func,
  activeTab: PropTypes.number,
};
