import React from "react";
import ProposalImages from "../index";
import renderer from "react-test-renderer";

const maliciousSVGFile = {
  name: "malicious",
  mime: "image/svg+xml",
  payload: `PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEU
  gc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9y
  Zy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgoKPHN2ZyB2ZXJzaW9uPSIxLjEiI
  GJhc2VQcm9maWxlPSJmdWxsIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPg
  ogICA8cG9seWdvbiBpZD0idHJpYW5nbGUiIHBvaW50cz0iMCwwIDAsNTAgNTAsMCIgZmlsbD0
  iIzAwOTkwMCIgc3Ryb2tlPSIjMDA0NDAwIi8+CiAgIDxzY3JpcHQgdHlwZT0idGV4dC9qYXZh
  c2NyaXB0Ij4KICAgIHdpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKCJodHRwOi8vd3d3Lmdvb2dsZ
  S5jb20iKTs7CiAgIDwvc2NyaXB0Pgo8L3N2Zz4K`,
  size: 405
};

const notMaliciousFile = {
  name: "notMalicious",
  mime: "image/svg+xml",
  payload: `PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogICA8cG9
  seWdvbiBzdHJva2U9IiMwMDQ0MDAiIGZpbGw9IiMwMDk5MDAiIHBvaW50cz0iMCwwIDAsNTAg
  NTAsMCIgaWQ9InRyaWFuZ2xlIj48L3BvbHlnb24+CiAgIAo8L3N2Zz4K`
};

it("sanitize SVG files", () => {
  const tree = renderer
    .create(
      <ProposalImages
        files={[maliciousSVGFile, notMaliciousFile]}
        onChange={() => null}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
