import React from "react";
import PropTypes from "prop-types";

export const exportToCsv = (data, fields, filename) => {
  const csvContent = data.reduce((acc, info) => {
    let row = "";
    fields.forEach(f => (row += `"${info[f]}",`));
    return acc + row + "\n";
  }, "");
  const titles = fields.reduce((acc, f) => acc + `"${f}",`, "");
  const csv = "data:text/csv;charset=utf-8," + titles + "\n" + csvContent;
  const content = encodeURI(csv);
  const link = document.createElement("a");
  link.setAttribute("href", content);
  link.setAttribute("download", filename);
  document.getElementById("csv-hidden-div").appendChild(link);
  link.click();
};

const ExportToCsv = ({ children, data, fields, filename }) => {
  const handleExportToCsv = () => {
    exportToCsv(data, fields, filename);
  };
  return (
    <>
      <div onClick={handleExportToCsv}>{children}</div>
      <div id="csv-hidden-div" style={{ display: "none" }} />
    </>
  );
};

ExportToCsv.propTypes = {
  children: PropTypes.node.isRequired,
  data: PropTypes.array.isRequired,
  filename: PropTypes.string.isRequired
};

export default ExportToCsv;
