import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { navigation } from "@politeiagui/core/globalServices";
import { Column, Row, classNames, useLockBodyScrollOnTrue } from "pi-ui";
import styles from "./Navbar.module.css";

function HamburgerToggle({ onToggle, isActive }) {
  return (
    <div
      data-testid="common-ui-navbar-toggle"
      className={styles.hamburgerToggleWrapper}
      onClick={() => (isActive ? onToggle(false) : onToggle(true))}
    >
      <div
        className={
          !isActive ? styles.hamburgerToggle : styles.hamburgerToggleClose
        }
      />
    </div>
  );
}

export function Navbar({ logo, children, drawerContent }) {
  const [showCollapsed, setShowCollapsed] = useState(false);
  useLockBodyScrollOnTrue(showCollapsed);
  // Collapse drawer on route change
  const currentLocation = useSelector(navigation.selectHistoryLastItem);
  useEffect(() => {
    setShowCollapsed(false);
  }, [currentLocation]);
  return (
    <>
      <nav className={styles.navWrapper} data-testid="common-ui-navbar">
        <Row className={styles.navbar} data-testid="common-ui-navbar-logo">
          <Column md={4} lg={2}>
            {logo}
          </Column>
          <Column md={0} lg={10}>
            <div className={styles.navItems}>{children}</div>
          </Column>
          <Column md={8} lg={0} className={styles.navItems}>
            <HamburgerToggle
              onToggle={setShowCollapsed}
              isActive={showCollapsed}
            />
          </Column>
        </Row>
      </nav>
      {showCollapsed && (
        <Row className={classNames(styles.collapsedNavWrapper)}>
          <Column xs={0} sm={5}>
            <span />
          </Column>
          <Column
            xs={12}
            sm={7}
            className={styles.collapsedNav}
            data-testid="common-ui-navbar-drawer"
          >
            <div className={classNames(styles.collapsedItems, styles.navItems)}>
              {children}
            </div>
            {drawerContent && (
              <div
                data-testid="common-ui-navbar-drawer-content"
                className={styles.drawerContent}
              >
                {drawerContent}
              </div>
            )}
          </Column>
        </Row>
      )}
    </>
  );
}

Navbar.propTypes = {
  logo: PropTypes.node,
  children: PropTypes.node,
  drawerContent: PropTypes.node,
};
