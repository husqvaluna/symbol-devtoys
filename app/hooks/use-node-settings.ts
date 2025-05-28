import { useAtom } from "jotai";
import { nodeSettingsAtom } from "~/atoms/network-atoms";
import type { NodeSettings } from "~/lib/node-settings";

export function useNodeSettings() {
  const [settings, setSettings] = useAtom(nodeSettingsAtom);

  const updateSettings = (newSettings: NodeSettings) => {
    try {
      setSettings(newSettings);
    } catch (error) {
      console.error("Failed to update node settings:", error);
    }
  };

  const getNodeUrls = (network: "testnet" | "mainnet"): string[] => {
    return settings[network] || [];
  };

  return {
    settings,
    isLoading: false, // jotaiでは初期化が同期的なのでローディング状態は不要
    updateSettings,
    getNodeUrls,
  };
}
