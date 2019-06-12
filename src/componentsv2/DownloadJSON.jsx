import React from "react";
import PropTypes from "prop-types";
import fileDownload from "js-file-download";
import { Link } from "pi-ui";

const DownloadJSON = ({
  content,
  fileName,
  label,
  customComponent,
  ...props
}) => {
  function onDownload() {
    const data = JSON.stringify(content, null, 2);
    fileDownload(data, `${fileName}.json`);
  }

  return !!customComponent ? (
    customComponent({ onDownload })
  ) : (
    <Link
      {...props}
      customComponent={props => (
        <span style={{ cursor: "pointer" }} {...props} onClick={onDownload}>
          {label}
        </span>
      )}
    />
  );
};

DownloadJSON.propTypes = {
  content: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  contentName: PropTypes.string
};

DownloadJSON.defaultProps = {
  contentName: "content.json"
};

export default DownloadJSON;
