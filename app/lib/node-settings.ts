export interface NodeSettings {
  TESTNET: string[];
  MAINNET: string[];
}

export const DEFAULT_SETTINGS: NodeSettings = {
  TESTNET: [
    "https://sym-test-01.opening-line.jp:3001",
    "https://sym-test-03.opening-line.jp:3001",
    "https://symbol-azure.0009.co:3001",
    "https://201-sai-dual.symboltest.net:3001",
    "https://node-t.sixis.xyz:3001",
    "https://vmi831828.contaboserver.net:3001",
  ],
  MAINNET: [
    "https://sym-main-01.opening-line.jp:3001",
    "https://sym-main-02.opening-line.jp:3001",
    "https://sym-main-03.opening-line.jp:3001",
    "https://pasomi.net:3001",
    "https://sakia.harvestasya.com:3001",
    "https://shoestring.pasomi.net:3001",
  ],
};

export function parseNodeUrls(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && line.startsWith("http"));
}

export function formatNodeUrls(urls: string[]): string {
  return urls.join("\n");
}
