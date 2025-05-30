import { expect, test } from "vitest";
import graph2tree from "./graph2tree";

test("reference from Root", () => {
  const json = require("./graph/fromLevel0.json");
  const expected = `# A01CF346..43E2 (C:3/A:3/R:1) <<
    └ 06193475..0772 (C:2/A:1/R:1)
        └ 465D4063..2F68
        └ 4FCBC947..D28D
    └ 92BE08D5..E910
    └ 9835C3BA..92C2 (C:3/A:2/R:1)
        └ 4F722246..B27F
        └ 8BFDE2C8..93E0 (C:1/A:1/R:1)
            └ A8443CB1..CC47
        └ 92BE08D5..E910`;
  expect(graph2tree(json)).toBe(expected);
});

test("reference from Root", () => {
  const json = require("./graph/fromLevel0.json");
  const expected = `# TAJPRPCJ..65XI (C:3/A:3/R:1) <<
    └ TC4YUUTH..74TA (C:2/A:1/R:1)
        └ TBVVJ2SF..E2OI
        └ TBSIQYVE..MLUQ
    └ TA3DKOSY..WEDI
    └ TCIEWKDV..POLQ (C:3/A:2/R:1)
        └ TAJXXUJN..2SUI
        └ TBXVHT4D..63MQ (C:1/A:1/R:1)
            └ TDYL7MLU..EO5Y
        └ TA3DKOSY..WEDI`;
  expect(graph2tree(json, { addressify: true })).toBe(expected);
});

test("Level3 Multisig Structure", () => {
  const json = require("./graph/level3.json");
  const expected = `# 53E5971F..67AA (C:2/A:1/R:2) <<
    └ 4F51CCC5..31AA (C:2/A:1/R:2)
        └ E9E9B98A..8561 (C:2/A:1/R:2)
            └ 9F4AE6DA..6D2A
            └ B07DB04C..3C6B
        └ F082C407..0351 (C:2/A:1/R:2)
            └ 621D90B5..3CB6
            └ ADA2847D..2A0F
    └ E39F3106..673E`;
  expect(graph2tree(json)).toBe(expected);
});

test("reference from Level1", () => {
  const json = require("./graph/fromLevel1.json");
  const expected = `# A01CF346..43E2 (C:3/A:3/R:1)
    └ 06193475..0772 (C:2/A:1/R:1) <<
        └ 465D4063..2F68
        └ 4FCBC947..D28D`;
  expect(graph2tree(json)).toBe(expected);
});

test("reference from Level2", () => {
  const json = require("./graph/fromLevel2.json");
  const expected = `# A01CF346..43E2 (C:3/A:3/R:1)
    └ 06193475..0772 (C:2/A:1/R:1)
        └ 465D4063..2F68 <<`;
  expect(graph2tree(json)).toBe(expected);
});

test("reference from Level3", () => {
  const json = require("./graph/fromLevel3.json");
  const expected = `# A01CF346..43E2 (C:3/A:3/R:1)
    └ 9835C3BA..92C2 (C:3/A:2/R:1)
        └ 8BFDE2C8..93E0 (C:1/A:1/R:1)
            └ A8443CB1..CC47 <<`;
  expect(graph2tree(json)).toBe(expected);
});
