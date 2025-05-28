import { useState, useEffect, useCallback } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import {
  selectedNetworkAtom,
  selectedNodeUrlAtom,
  availableNodesAtom,
  isValidNodeSelectionAtom,
  type NetworkType
} from '../atoms/network-atoms';
import { useNodeSettings } from './use-node-settings';

export interface NetworkSelectionState {
  selectedNetwork: 'testnet' | 'mainnet';
  selectedNodeUrl: string | null;
  availableNodes: string[];
  isLoading: boolean;
}

export interface NetworkSelectionActions {
  setNetwork: (network: 'testnet' | 'mainnet') => void;
  setNodeUrl: (nodeUrl: string) => void;
  getNodeUrl: () => string | null;
}

export function useNetworkSelection(): NetworkSelectionState & NetworkSelectionActions {
  const { isLoading: nodeSettingsLoading } = useNodeSettings();

  // jotaiのatomsを使用
  const [selectedNetwork, setSelectedNetworkAtom] = useAtom(selectedNetworkAtom);
  const [selectedNodeUrl, setSelectedNodeUrlAtom] = useAtom(selectedNodeUrlAtom);
  const availableNodes = useAtomValue(availableNodesAtom);
  const isValidNodeSelection = useAtomValue(isValidNodeSelectionAtom);

  // 初期化処理用のローカル状態
  const [isLoading, setIsLoading] = useState(true);

  // 初期化とノード自動選択の処理
  useEffect(() => {
    if (!nodeSettingsLoading) {
      // 選択されたノードが現在のネットワークで利用可能かチェック
      if (!isValidNodeSelection && availableNodes.length > 0) {
        // 利用可能でない場合は最初のノードを選択
        const firstNode = availableNodes[0];
        setSelectedNodeUrlAtom(firstNode);
      } else if (selectedNodeUrl === null && availableNodes.length > 0) {
        // ノードが選択されていない場合は最初のノードを選択
        const firstNode = availableNodes[0];
        setSelectedNodeUrlAtom(firstNode);
      }
      setIsLoading(false);
    }
  }, [nodeSettingsLoading, isValidNodeSelection, availableNodes, selectedNodeUrl, setSelectedNodeUrlAtom]);

  const setNetwork = useCallback((network: NetworkType) => {
    setSelectedNetworkAtom(network);
    // ネットワーク変更時は自動的にノード選択がリセットされるため、
    // useEffectで適切なノードが自動選択される
  }, [setSelectedNetworkAtom]);

  const setNodeUrl = useCallback((nodeUrl: string) => {
    setSelectedNodeUrlAtom(nodeUrl);
  }, [setSelectedNodeUrlAtom]);

  const getNodeUrl = useCallback((): string | null => {
    return selectedNodeUrl;
  }, [selectedNodeUrl]);

  return {
    selectedNetwork,
    selectedNodeUrl,
    availableNodes,
    isLoading: isLoading || nodeSettingsLoading,
    setNetwork,
    setNodeUrl,
    getNodeUrl,
  };
}
