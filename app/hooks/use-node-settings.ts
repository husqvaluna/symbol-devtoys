import { useState, useEffect } from 'react';
import { getNodeSettings, saveNodeSettings, type NodeSettings } from '~/lib/node-settings';

export function useNodeSettings() {
  const [settings, setSettings] = useState<NodeSettings>({ testnet: [], mainnet: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = () => {
      try {
        const nodeSettings = getNodeSettings();
        setSettings(nodeSettings);
      } catch (error) {
        console.error('Failed to load node settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSettings = (newSettings: NodeSettings) => {
    setSettings(newSettings);
    saveNodeSettings(newSettings);
  };

  const getNodeUrls = (network: 'testnet' | 'mainnet'): string[] => {
    return settings[network] || [];
  };

  const getRandomNodeUrl = (network: 'testnet' | 'mainnet'): string | null => {
    const urls = getNodeUrls(network);
    if (urls.length === 0) return null;
    return urls[Math.floor(Math.random() * urls.length)];
  };

  return {
    settings,
    isLoading,
    updateSettings,
    getNodeUrls,
    getRandomNodeUrl,
  };
}
