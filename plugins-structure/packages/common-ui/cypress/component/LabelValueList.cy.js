import React from "react";
import { LabelValueList } from "../../src/components/LabelValueList";

describe("<LabelValueList />", () => {
  it("should render list correctly with `label: value`", () => {
    cy.mount(
      <LabelValueList
        items={[
          { label: "foo", value: "bar" },
          { label: "foo2", value: "bar2" },
        ]}
      />
    );
    cy.contains("foo:bar");
    cy.contains("foo2:bar2");
  });
});
