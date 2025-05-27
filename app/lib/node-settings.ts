export interface NodeSettings {
  testnet: string[];
  mainnet: string[];
}

const STORAGE_KEY = 'symbol-devtoys-node-settings';

const DEFAULT_SETTINGS: NodeSettings = {
  testnet: [
    'https://sym-test-01.opening-line.jp:3001',
    'https://sym-test-02.opening-line.jp:3001',
    'https://sym-test-03.opening-line.jp:3001'
  ],
  mainnet: [
    'https://sym-main-01.opening-line.jp:3001',
    'https://sym-main-02.opening-line.jp:3001',
    'https://sym-main-03.opening-line.jp:3001'
  ]
};

export function getNodeSettings(): NodeSettings {
  if (typeof window === 'undefined') {
    return { ...DEFAULT_SETTINGS };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        testnet: Array.isArray(parsed.testnet) ? parsed.testnet : [...DEFAULT_SETTINGS.testnet],
        mainnet: Array.isArray(parsed.mainnet) ? parsed.mainnet : [...DEFAULT_SETTINGS.mainnet],
      };
    }
  } catch (error) {
    console.error('Failed to load node settings:', error);
  }

  return { ...DEFAULT_SETTINGS };
}

export function saveNodeSettings(settings: NodeSettings): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save node settings:', error);
  }
}

export function parseNodeUrls(text: string): string[] {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0 && line.startsWith('http'));
}

export function formatNodeUrls(urls: string[]): string {
  return urls.join('\n');
}
