import PropTypes from "prop-types";
import qr from "qr-image";
import React from "react";

const QRCode = ({ addr }) => {
  const qr_img = qr.imageSync("decred:" + addr, { type: "svg" });
  return <div dangerouslySetInnerHTML={{ __html: qr_img }} />;
};

QRCode.propTypes = {
  addr: PropTypes.string
};

export default QRCode;
