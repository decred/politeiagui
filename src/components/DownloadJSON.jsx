import React, { useState } from "react";
import PropTypes from "prop-types";
import fileDownload from "js-file-download";
import { Link, Spinner } from "pi-ui";

const isPromise = (obj) => obj && typeof obj.then === "function";

const validateBeforeDownloadProp = function (props, beforeDownload) {
  if (
    props["isAsync"] === true &&
    props[beforeDownload] === undefined &&
    !isPromise(props[beforeDownload])
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
  const [asyncLoading, setAsyncLoading] = useState(false);
  function onDownload() {
    const data = JSON.stringify(content, null, 2);
    fileDownload(data, `${fileName}.json`);
  }

  function handleDownload() {
    setAsyncLoading(true);
    beforeDownload().then((response) => {
      setAsyncLoading(false);
      const data = JSON.stringify(response, null, 2);
      fileDownload(data, `${fileName}.json`);
    });
  }

  return customComponent ? (
    customComponent({ onDownload })
  ) : (
    <Link
      {...props}
      customComponent={(props) =>
        isAsync && asyncLoading ? (
          <Spinner invert />
        ) : (
          <span
            style={{ cursor: "pointer" }}
            {...props}
            onClick={!isAsync ? onDownload : handleDownload}>
            {label}
          </span>
        )
      }
    />
  );
};

DownloadJSON.propTypes = {
  content: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
  beforeDownload: validateBeforeDownloadProp
};

export default DownloadJSON;
