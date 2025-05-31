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

const mermaidDefaultOptions = {
  head: 8,
  tail: 4,
  truncated: true,
  direction: "TD",
  nodeShape: "rect",
  showDetails: true,
  theme: "default",
};

export type MermaidOptions = Partial<typeof mermaidDefaultOptions>;

export const renderMermaid = (tree: NodeTuple[], options: MermaidOptions = {}): string => {
  const opts = { ...asciiDefaultOptions, ...options };
  // TODO: ここに実装する
}
