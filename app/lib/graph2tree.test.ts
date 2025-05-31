import { expect, test } from "vitest";
import graph2tree, { renderAscii } from "./graph2tree";

test("reference from Root", () => {
  const json = require("./graph/fromLevel0.json");
  const expected = `# 9815758B..8AAE (C:3/A:2/R:1) <<
    └ 9856A7DB..5F24 (C:2/A:2/R:1)
        └ 98405015..64B0
        └ 98AE9CAF..D358
    └ 986D8EE4..CEBB (C:3/A:2/R:1)
        └ 9804E7EC..780A
        └ 98ACC4FB..523A
        └ 98B9A474..A157 (C:1/A:1/R:1)
            └ 98ADB16E..6E9B
    └ 98E3E132..C30F`;
  const tree = graph2tree(json);
  expect(renderAscii(tree, {})).toBe(expected);
});

test("reference from Root", () => {
  const json = require("./graph/fromLevel0.json");
  const expected = `# TAKXLCYU..YVLQ (C:3/A:2/R:1) <<
    └ TBLKPW6L..F6JA (C:2/A:2/R:1)
        └ TBAFAFMW..WJMA
        └ TCXJZL3F..NGWA
    └ TBWY5ZH6..M5OY (C:3/A:2/R:1)
        └ TACOP3GK..HQCQ
        └ TCWMJ6YS..FEOQ
        └ TC42I5D4..KCVY (C:1/A:1/R:1)
            └ TCW3C3VQ..W5GY
    └ TDR6CMWU..MGDY`;
  const tree = graph2tree(json);
  expect(renderAscii(tree, { readableAddress: true })).toBe(expected);
});

test("reference from Level1", () => {
  const json = require("./graph/fromLevel1.json");
  const expected = `# 9815758B..8AAE (C:3/A:2/R:1)
    └ 9856A7DB..5F24 (C:2/A:2/R:1) <<
        └ 98405015..64B0
        └ 98AE9CAF..D358`;
  const tree = graph2tree(json);
  expect(renderAscii(tree, {})).toBe(expected);
});

test("reference from Level2", () => {
  const json = require("./graph/fromLevel2.json");
  const expected = `# 9815758B..8AAE (C:3/A:2/R:1)
    └ 986D8EE4..CEBB (C:3/A:2/R:1)
        └ 9804E7EC..780A <<`;
  const tree = graph2tree(json);
  expect(renderAscii(tree, {})).toBe(expected);
});

test("reference from Level3", () => {
  const json = require("./graph/fromLevel3.json");
  const expected = `# 9815758B..8AAE (C:3/A:2/R:1)
    └ 986D8EE4..CEBB (C:3/A:2/R:1)
        └ 98B9A474..A157 (C:1/A:1/R:1)
            └ 98ADB16E..6E9B <<`;
  const tree = graph2tree(json);
  expect(renderAscii(tree, {})).toBe(expected);
});
