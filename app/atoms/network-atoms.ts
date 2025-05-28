import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { NodeSettings } from "../lib/node-settings";
import { DEFAULT_SETTINGS } from "../lib/node-settings";

// ネットワーク型の定義
export type NetworkType = "testnet" | "mainnet";

// 基本的なatoms（永続化あり）
export const selectedNetworkAtom = atomWithStorage<NetworkType>("symbol-devtoys-selected-network", "testnet");

export const selectedNodeUrlAtom = atomWithStorage<string | null>("symbol-devtoys-selected-node-url", null);

export const nodeSettingsAtom = atomWithStorage<NodeSettings>("symbol-devtoys-node-settings", DEFAULT_SETTINGS);

// 派生atom: 選択されたネットワークで利用可能なノードURLの配列
export const availableNodesAtom = atom<string[]>((get) => {
  const selectedNetwork = get(selectedNetworkAtom);
  const nodeSettings = get(nodeSettingsAtom);
  return nodeSettings[selectedNetwork] || [];
});

// 派生atom: 選択されたノードURLが現在のネットワークで有効かどうかを判定
export const isValidNodeSelectionAtom = atom<boolean>((get) => {
  const selectedNodeUrl = get(selectedNodeUrlAtom);
  const availableNodes = get(availableNodesAtom);

  if (selectedNodeUrl === null) {
    return false;
  }

  return availableNodes.includes(selectedNodeUrl);
});
