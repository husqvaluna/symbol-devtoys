import { encodeAddress } from "~/logics/convert";

export interface MultisigEntity {
  version: number;
  accountAddress: string;
  minApproval: number;
  minRemoval: number;
  cosignatoryAddresses: string[];
  multisigAddresses: string[];
}

export interface MultisigEntry {
  multisig: MultisigEntity;
}

export interface MultisigLayer {
  level: number;
  multisigEntries: MultisigEntry[];
}

type NodeTuple = [number, MultisigEntry, NodeTuple[]];

export const graph2tree = (graph: MultisigLayer[]): NodeTuple[] => {
  const tree: NodeTuple[] = [];
  for (const layer of graph) {
    if (tree.length === 0) {
      const entry = layer.multisigEntries[0];
      tree.push([layer.level, entry, []]);
    } else {
      layer.multisigEntries.forEach((entry) => {
        const parentNode = findParentNode(tree, entry.multisig.accountAddress, layer.level);
        if (parentNode) {
          parentNode[2].push([layer.level, entry, []]);
        }
      });
    }
  }
  return tree;
};

const findParentNode = (tree: NodeTuple[], account: string, level: number): NodeTuple | undefined => {
  const parentNode = tree.find((n) => n[1].multisig.cosignatoryAddresses.includes(account));
  if (parentNode && level - parentNode[0] === 1) {
    return parentNode;
  }
  for (const n of tree) {
    const found = findParentNode(n[2], account, level);
    if (found) {
      return found;
    }
  }
  return undefined;
};

export default graph2tree;

// ---------------------------------------------------------

const asciiDefaultOptions = {
  referer: "<<",
  root: "#",
  child: "└",
  head: 8,
  tail: 4,
  truncated: true,
  readableAddress: false,
};

export type AsciiOptions = Partial<typeof asciiDefaultOptions>;

export const renderAscii = (tree: NodeTuple[], options: AsciiOptions = {}): string => {
  const opts = { ...asciiDefaultOptions, ...options };
  const buf: string[] = [];

  const renderLine = (entry: MultisigEntry, level: number, refinedLevel: number, end: boolean) => {
    const pad = "  ".repeat(refinedLevel * 2) + (refinedLevel === 0 ? `${opts.root} ` : `${opts.child} `);
    const msig = entry.multisig;

    const ref = level == 0 ? ` ${opts.referer}` : "";
    const nOfm =
      msig.cosignatoryAddresses.length === 0 ? "" : ` (C:${msig.cosignatoryAddresses.length}/A:${msig.minApproval}/R:${msig.minRemoval})`;

    const identifier = opts.readableAddress ? encodeAddress(msig.accountAddress).toString() : msig.accountAddress;
    const identifierToDisplay = opts.truncated
      ? `${identifier.slice(0, opts.head)}..${identifier.slice((opts.tail || 0) * -1)}`
      : identifier;
    buf.push(`${pad}${identifierToDisplay}${nOfm}${ref}`);
  };

  const putIntoBuf = (node: NodeTuple, level: number, end: boolean) => {
    renderLine(node[1], node[0], level, end);
    level++;
    for (let i = 0; i < node[2].length; i++) {
      putIntoBuf(node[2][i], level, node[2].length - 1 === i);
    }
  };

  putIntoBuf(tree[0], 0, true);
  return buf.join("\n");
};

// ---------------------------------------------------------

export interface IMermaidOptions {
  truncated?: boolean;
  head?: number;
  tail?: number;
  direction?: "TD" | "LR" | "BT" | "RL";
  nodeShape?: "rect" | "round" | "circle" | "rhombus";
  showDetails?: boolean;
  theme?: "default" | "dark" | "forest" | "base";
}

const mermaidDefaultOptions: IMermaidOptions = {
  head: 8,
  tail: 4,
  truncated: true,
  direction: "TD",
  nodeShape: "rect",
  showDetails: true,
  theme: "default",
};

export type MermaidOptions = IMermaidOptions;

// プリセット定義
export const mermaidPresets = {
  simple: {
    truncated: true,
    head: 6,
    tail: 4,
    direction: "TD" as const,
    nodeShape: "round" as const,
    showDetails: false,
    theme: "default" as const,
  },
  detailed: {
    truncated: true,
    head: 8,
    tail: 4,
    direction: "TD" as const,
    nodeShape: "rect" as const,
    showDetails: true,
    theme: "default" as const,
  },
  compact: {
    truncated: true,
    head: 4,
    tail: 2,
    direction: "LR" as const,
    nodeShape: "circle" as const,
    showDetails: false,
    theme: "dark" as const,
  },
} as const;

// プリセットを使用したレンダリング関数
export const renderMermaidWithPreset = (tree: NodeTuple[], preset: keyof typeof mermaidPresets = "detailed", referer?: string): string => {
  return renderMermaid(tree, referer, mermaidPresets[preset]);
};

// MultisigLayerからNodeTupleに変換してレンダリングする便利関数
export const renderMermaidFromGraph = (graph: MultisigLayer[], referer?: string, options: MermaidOptions = {}): string => {
  const tree = graph2tree(graph);
  if (tree.length === 0) {
    return "";
  }

  // refererが指定されていない場合は、レベル0のアカウントアドレスを使用
  const refererAddress = referer || graph.find((l) => l.level === 0)?.multisigEntries[0]?.multisig.accountAddress;

  return renderMermaid(tree, refererAddress, options);
};

// プリセットを使用したグラフからのレンダリング関数
export const renderMermaidFromGraphWithPreset = (
  graph: MultisigLayer[],
  preset: keyof typeof mermaidPresets = "detailed",
  referer?: string,
): string => {
  const tree = graph2tree(graph);
  if (tree.length === 0) {
    return "";
  }

  const refererAddress = referer || graph.find((l) => l.level === 0)?.multisigEntries[0]?.multisig.accountAddress;

  return renderMermaidWithPreset(tree, preset, refererAddress);
};

// サンプルデータ作成用のヘルパー関数
export const createSampleMultisigGraph = (): MultisigLayer[] => {
  return [
    {
      level: 0,
      multisigEntries: [
        {
          multisig: {
            version: 1,
            accountAddress: "TCTXJKIXWH4CVMOJLQPQJ5Z2XMGZWRGDWSRHQKQ",
            minApproval: 2,
            minRemoval: 2,
            cosignatoryAddresses: ["TCTXJKIXWH4CVMOJLQPQJ5Z2XMGZWRGDWSRHQKR", "TCTXJKIXWH4CVMOJLQPQJ5Z2XMGZWRGDWSRHQKS"],
            multisigAddresses: [],
          },
        },
      ],
    },
    {
      level: 1,
      multisigEntries: [
        {
          multisig: {
            version: 1,
            accountAddress: "TCTXJKIXWH4CVMOJLQPQJ5Z2XMGZWRGDWSRHQKR",
            minApproval: 1,
            minRemoval: 1,
            cosignatoryAddresses: ["TCTXJKIXWH4CVMOJLQPQJ5Z2XMGZWRGDWSRHQKT", "TCTXJKIXWH4CVMOJLQPQJ5Z2XMGZWRGDWSRHQKU"],
            multisigAddresses: [],
          },
        },
      ],
    },
  ];
};

export const renderMermaid = (tree: NodeTuple[], referer?: string, options: MermaidOptions = {}): string => {
  const opts = { ...mermaidDefaultOptions, ...options };

  if (tree.length === 0) {
    return "";
  }

  // refererが指定されていない場合は、ルートノードのアドレスを使用
  const refererAddress = referer || tree[0][1].multisig.accountAddress;

  return buildMermaidOutput(tree, refererAddress, opts);
};

const buildMermaidOutput = (tree: NodeTuple[], referer: string, opts: IMermaidOptions): string => {
  const buf: string[] = [];
  const nodeMap = new Map<string, string>();
  let nodeCounter = 0;

  // Mermaidヘッダー
  buf.push(`%%{init: {'theme':'${opts.theme}'}}%%`);
  buf.push(`graph ${opts.direction}`);
  buf.push("");

  // ノードとエッジを収集
  const edges: string[] = [];
  collectNodesAndEdges(tree[0], buf, edges, nodeMap, nodeCounter, referer, opts);

  // エッジを追加
  if (edges.length > 0) {
    buf.push("");
    buf.push("%% Connections");
    edges.forEach((edge) => buf.push(`    ${edge}`));
  }

  // スタイリング
  buf.push("");
  buf.push("%% Styling");
  nodeMap.forEach((nodeId, accountAddress) => {
    if (accountAddress === referer) {
      buf.push(`    classDef referer fill:#ff6b6b,stroke:#d63031,stroke-width:3px,color:#fff`);
      buf.push(`    class ${nodeId} referer`);
    } else {
      buf.push(`    classDef multisig fill:#74b9ff,stroke:#0984e3,stroke-width:2px,color:#fff`);
      buf.push(`    class ${nodeId} multisig`);
    }
  });

  return buf.join("\n");
};

const collectNodesAndEdges = (
  node: NodeTuple,
  buf: string[],
  edges: string[],
  nodeMap: Map<string, string>,
  nodeCounter: number,
  referer: string,
  opts: IMermaidOptions,
  parentNodeId?: string,
): number => {
  const [level, entry] = node;
  const msig = entry.multisig;

  // ノードIDを生成
  const nodeId = `N${nodeCounter++}`;
  nodeMap.set(msig.accountAddress, nodeId);

  // ノードラベルを作成
  const identifier = opts.truncated
    ? `${msig.accountAddress.slice(0, opts.head)}..${msig.accountAddress.slice((opts.tail || 0) * -1)}`
    : msig.accountAddress;

  const isReferer = msig.accountAddress === referer;
  const refererMark = isReferer ? " 🏠" : "";

  let nodeLabel = identifier + refererMark;

  if (opts.showDetails && msig.cosignatoryAddresses.length > 0) {
    const details = `<br/>C:${msig.cosignatoryAddresses.length} A:${msig.minApproval} R:${msig.minRemoval}`;
    nodeLabel += details;
  }

  // ノード形状を決定
  let nodeDeclaration = "";
  switch (opts.nodeShape) {
    case "round":
      nodeDeclaration = `${nodeId}(${nodeLabel})`;
      break;
    case "circle":
      nodeDeclaration = `${nodeId}((${nodeLabel}))`;
      break;
    case "rhombus":
      nodeDeclaration = `${nodeId}{${nodeLabel}}`;
      break;
    case "rect":
    default:
      nodeDeclaration = `${nodeId}[${nodeLabel}]`;
      break;
  }

  buf.push(`    ${nodeDeclaration}`);

  // 親ノードとの接続を作成
  if (parentNodeId) {
    edges.push(`${parentNodeId} --> ${nodeId}`);
  }

  // 子ノードを処理
  for (const child of node[2]) {
    nodeCounter = collectNodesAndEdges(child, buf, edges, nodeMap, nodeCounter, referer, opts, nodeId);
  }

  return nodeCounter;
};
