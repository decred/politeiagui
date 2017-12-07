import React from "react";

const FileDownloadLink = ({
  children,
  filename="download.txt",
  mime="text/plain;charset=utf-8",
  data
}) => (
  <a
    href={`data:${mime},${encodeURIComponent(data)}`}
    download={filename}
  >
    {children}
  </a>
);

export default FileDownloadLink;
