import { expect, test } from "vitest";
import graph2tree, { renderAscii, renderMermaid, renderMermaidWithPreset, createSampleMultisigGraph } from "./graph2tree";

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

test("renderMermaid basic functionality", () => {
  const json = require("./graph/fromLevel0.json");
  const tree = graph2tree(json);
  const mermaidOutput = renderMermaid(tree);

  // Mermaidの基本構造をチェック
  expect(mermaidOutput).toContain("%%{init: {'theme':'default'}}%%");
  expect(mermaidOutput).toContain("graph TD");
  expect(mermaidOutput).toContain("N0[");
  expect(mermaidOutput).toContain("🏠"); // refererマーク
  expect(mermaidOutput).toContain("classDef referer");
  expect(mermaidOutput).toContain("classDef multisig");
});

test("renderMermaid with custom options", () => {
  const json = require("./graph/fromLevel0.json");
  const tree = graph2tree(json);
  const mermaidOutput = renderMermaid(tree, undefined, {
    direction: "LR",
    nodeShape: "round",
    theme: "dark",
    showDetails: false,
  });

  expect(mermaidOutput).toContain("graph LR");
  expect(mermaidOutput).toContain("%%{init: {'theme':'dark'}}%%");
  expect(mermaidOutput).toContain("N0("); // round shape
  expect(mermaidOutput).not.toContain("<br/>"); // no details
});

test("renderMermaidWithPreset", () => {
  const sampleGraph = createSampleMultisigGraph();
  const tree = graph2tree(sampleGraph);

  // simpleプリセットのテスト
  const simpleOutput = renderMermaidWithPreset(tree, "simple");
  expect(simpleOutput).toContain("N0("); // round shape
  expect(simpleOutput).not.toContain("<br/>"); // no details

  // detailedプリセットのテスト
  const detailedOutput = renderMermaidWithPreset(tree, "detailed");
  expect(detailedOutput).toContain("N0["); // rect shape
  expect(detailedOutput).toContain("<br/>"); // with details

  // compactプリセットのテスト
  const compactOutput = renderMermaidWithPreset(tree, "compact");
  expect(compactOutput).toContain("graph LR");
  expect(compactOutput).toContain("N0(("); // circle shape
  expect(compactOutput).toContain("%%{init: {'theme':'dark'}}%%");
});

test("renderMermaid with custom referer", () => {
  const sampleGraph = createSampleMultisigGraph();
  const tree = graph2tree(sampleGraph);
  const customReferer = "TCTXJKIXWH4CVMOJLQPQJ5Z2XMGZWRGDWSRHQKR";

  const mermaidOutput = renderMermaid(tree, customReferer);

  // カスタムrefererが正しく設定されているかチェック
  expect(mermaidOutput).toContain("🏠");
  expect(mermaidOutput).toContain("class N1 referer"); // N1がrefererになるはず
});

test("createSampleMultisigGraph", () => {
  const sampleGraph = createSampleMultisigGraph();

  expect(sampleGraph).toHaveLength(2);
  expect(sampleGraph[0].level).toBe(0);
  expect(sampleGraph[1].level).toBe(1);
  expect(sampleGraph[0].multisigEntries[0].multisig.cosignatoryAddresses).toHaveLength(2);
  expect(sampleGraph[1].multisigEntries[0].multisig.cosignatoryAddresses).toHaveLength(2);
});
