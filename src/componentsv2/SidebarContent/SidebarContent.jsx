import { Card, classNames } from "pi-ui";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import { useConfig } from "src/Config";
import PaywallMessage from "../PaywallMessage";
import StaticMarkdown from "../StaticMarkdown/StaticMarkdown";
import styles from "./SidebarContent.module.css";

const SidebarBlock = ({ children, className, ...props }) => (
  <Card
    className={classNames(styles.sideBarBlockWrapper, className)}
    {...props}
  >
    {children}
  </Card>
);

const SidebarContent = ({ wrapper }) => {
  const WrapperComponent = wrapper;
  const { aboutContent } = useConfig();

  return useMemo(
    () => (
      <WrapperComponent>
        <PaywallMessage
          wrapper={SidebarBlock}
          className={classNames(styles.sideBarBlockWrapper, "margin-bottom-s")}
          marker
        />
        <SidebarBlock>
          <StaticMarkdown contentName={aboutContent} />
        </SidebarBlock>
      </WrapperComponent>
    ),
    [aboutContent]
  );
};

SidebarContent.propTypes = {
  wrapper: PropTypes.element
};

SidebarContent.defaultProps = {
  wrapper: React.Fragment
};

export default SidebarContent;
