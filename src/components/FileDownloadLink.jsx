import React from "react";

const FileDownloadLink = ({
  children,
  style,
  filename = "download.txt",
  mime = "text/plain;charset=utf-8",
  data
}) => (
  <a
    style={style}
    className="download-link"
    href={`data:${mime},${encodeURIComponent(data)}`}
    download={filename}
  >
    {children}
  </a>
);

export default FileDownloadLink;
