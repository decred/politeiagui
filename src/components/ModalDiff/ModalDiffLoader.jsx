import React from "react";
import { Modal, getThemeProperty, useTheme } from "pi-ui";
import ContentLoader from "react-content-loader";
import styles from "./ModalDiff.module.css";

const ModalDiffLoader = ({ onClose, ...props }) => {
  const { theme } = useTheme();
  const primaryColor = getThemeProperty(theme, "card-background");
  const secondaryColor = getThemeProperty(theme, "dimmed-card-background");
  return (
    <Modal
      onClose={onClose}
      {...props}
      contentStyle={{ width: "100%", minHeight: "40rem" }}>
      <div className={styles.loaderWrapper}>
        <ContentLoader
          height={500}
          width={800}
          speed={2}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}>
          <rect x="0" y="0" width="700" height="30" />
          <rect x="0" y="50" width="100" height="20" />
          <rect x="120" y="50" width="100" height="20" />
          <rect x="240" y="50" width="100" height="20" />
          <rect x="0" y="90" width="800" height="400" />
        </ContentLoader>
      </div>
    </Modal>
  );
};

export default ModalDiffLoader;
