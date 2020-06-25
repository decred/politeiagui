import { getLineitemsDiff, setLineitemParams } from "../helpers";

const oldItem = {
  description: "old description",
  domain: "Development",
  expenses: 0,
  labor: 3000,
  proposaltoken: "",
  subdomain: "old subdomain",
  subrate: 0,
  subuserid: "",
  type: 1
};
const newItem = {
  description: "new description",
  domain: "Development",
  expenses: 0,
  labor: 3000,
  proposaltoken: "",
  subdomain: "new subdomain",
  subrate: 0,
  subuserid: "",
  type: 1
};

const oldLineItems = [oldItem];
const newLineItems = [newItem];

describe("test diff helpers functions", () => {
  test("test getLineitemsDiff", () => {
    const expectedDiffResult = [
      { ...newItem, added: true },
      { ...oldItem, removed: true }
    ];

    const expectedAdition = [{ ...newItem, added: true }, oldItem];
    const expectedRemoval = [{ ...oldItem, removed: true }, newItem];

    expect(getLineitemsDiff(newLineItems, oldLineItems)).toEqual(
      expectedDiffResult
    );
    expect(getLineitemsDiff(newLineItems, newLineItems)).toEqual(newLineItems);
    expect(
      getLineitemsDiff([...oldLineItems, ...newLineItems], oldLineItems)
    ).toEqual(expectedAdition);
    expect(
      getLineitemsDiff(newLineItems, [...newLineItems, ...oldLineItems])
    ).toEqual(expectedRemoval);
  });

  test("test setLineitemParams", () => {
    const expectedResult = [
      { ...newItem, rate: 20, index: 0 },
      { ...oldItem, rate: 20, index: 1 }
    ];
    expect(
      setLineitemParams([...newLineItems, ...oldLineItems], { rate: 20 })
    ).toEqual(expectedResult);
  });
});
