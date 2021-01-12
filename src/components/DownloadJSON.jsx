import React from "react";
import PropTypes from "prop-types";
import fileDownload from "js-file-download";
import { Link } from "pi-ui";

const validateBeforeDownloadProp = function (props, beforeDownload) {
  if (
    props["isAsync"] === true &&
    props[beforeDownload] === undefined &&
    !(props[beforeDownload] instanceof Promise)
  ) {
    throw new Error("beforeDownload prop must be a Promise");
  }
};

const DownloadJSON = ({
  content,
  fileName,
  label,
  customComponent,
  isAsync,
  beforeDownload,
  ...props
}) => {
  function onDownload() {
    const data = JSON.stringify(content, null, 2);
    fileDownload(data, `${fileName}.json`);
  }

  function handleDownload() {
    beforeDownload().then((response) => {
      const data = JSON.stringify(response, null, 2);
      fileDownload(data, `${fileName}.json`);
    });
  }

  return customComponent ? (
    customComponent({ onDownload })
  ) : (
    <Link
      {...props}
      customComponent={(props) => (
        <span
          style={{ cursor: "pointer" }}
          {...props}
          onClick={!isAsync ? onDownload : handleDownload}>
          {label}
        </span>
      )}
    />
  );
};

DownloadJSON.propTypes = {
  content: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  beforeDownload: validateBeforeDownloadProp
};

export default DownloadJSON;
