import { encodeAddress } from "~/logics/convert";

export interface IMultisig {
  version: number;
  accountAddress: string;
  minApproval: number;
  minRemoval: number;
  cosignatoryAddresses: string[];
  multisigAddresses: string[];
}

export interface IEntry {
  multisig: IMultisig;
}

export interface ILayer {
  level: number;
  multisigEntries: IEntry[];
}

export const defaultOptions = {
  referer: "<<",
  root: "#",
  child: "└",
  head: 8,
  tail: 4,
  truncated: true,
  readableAddress: false,
};

export type IOptions = Partial<typeof defaultOptions>;

export type NodeTuple = [number, IEntry, NodeTuple[]];

type InternalOptions = typeof defaultOptions;

export const graph2tree = (graph: ILayer[], options: IOptions = {}) => {
  const layer = graph.find((l: ILayer) => l.level === 0);
  const referer = layer ? layer.multisigEntries[0].multisig.accountAddress : "";
  const tree = buildTree(graph);
  return buildTextOutput(tree, referer, { ...defaultOptions, ...options });
};

export const buildTree = (graph: ILayer[]): NodeTuple[] => {
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

// ---------------------------------------------------------

const buildTextOutput = (tree: NodeTuple[], referer: string, options: InternalOptions): string => {
  const buf: string[] = [];

  const renderLine = (entry: IEntry, level: number, end: boolean) => {
    const pad = "  ".repeat(level * 2) + (level === 0 ? `${options.root} ` : `${options.child} `);
    const msig = entry.multisig;
    const ref = msig.accountAddress === referer ? ` ${options.referer}` : "";
    const nOfm =
      msig.cosignatoryAddresses.length === 0 ? "" : ` (C:${msig.cosignatoryAddresses.length}/A:${msig.minApproval}/R:${msig.minRemoval})`;

    const identifier = options.readableAddress ? encodeAddress(msig.accountAddress).toString() : msig.accountAddress;
    const identifierToDisplay = options.truncated
      ? `${identifier.slice(0, options.head)}..${identifier.slice((options.tail || 0) * -1)}`
      : identifier;
    buf.push(`${pad}${identifierToDisplay}${nOfm}${ref}`);
  };

  const putIntoBuf = (node: NodeTuple, level: number, end: boolean) => {
    renderLine(node[1], level, end);
    level++;
    for (let i = 0; i < node[2].length; i++) {
      putIntoBuf(node[2][i], level, node[2].length - 1 === i);
    }
  };

  putIntoBuf(tree[0], 0, true);
  return buf.join("\n");
};

export default graph2tree;
