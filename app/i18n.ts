import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import './types/i18n';

// 翻訳リソース
const resources = {
  ja: {
    translation: {
      // メニュー項目
      menu: {
        home: 'ホーム',
        keypair: 'キーペア',
        account: 'アカウント',
        monitor: 'モニター',
        namespace: 'ネームスペース',
        mosaic: 'モザイク',
        block: 'ブロック',
        transaction: 'トランザクション',
        node: 'ノード',
        network: 'ネットワーク',
        payload: 'ペイロード',
        fee: '手数料計算機',
      },
      // ホーム画面
      home: {
        title: 'Symbol DevToys',
        subtitle: 'Symbol ブロックチェーン開発者向けツール集',
        meta: {
          title: 'Symbol DevToys - ホーム',
          description: 'Symbol DevToys のホームページ',
        },
        categories: {
          accountManagement: {
            title: 'アカウント管理',
            description: 'キーペアの生成やアカウント情報の確認ができます',
          },
          blockchainMonitoring: {
            title: 'ブロックチェーン監視',
            description: 'ブロック、トランザクション、ネットワークの状態を監視できます',
          },
          assetManagement: {
            title: 'アセット管理',
            description: 'ネームスペースやモザイクの作成・管理ができます',
          },
          developmentSupport: {
            title: '開発支援',
            description: 'ペイロード作成や手数料計算などの開発支援ツールです',
          },
        },
      },
    },
  },
  en: {
    translation: {
      // Menu items
      menu: {
        home: 'Home',
        keypair: 'Keypair',
        account: 'Account',
        monitor: 'Monitor',
        namespace: 'Namespace',
        mosaic: 'Mosaic',
        block: 'Block',
        transaction: 'Transaction',
        node: 'Node',
        network: 'Network',
        payload: 'Payload',
        fee: 'Fee Calculator',
      },
      // Home screen
      home: {
        title: 'Symbol DevToys',
        subtitle: 'Developer tools for Symbol blockchain',
        meta: {
          title: 'Symbol DevToys - Home',
          description: 'Symbol DevToys homepage',
        },
        categories: {
          accountManagement: {
            title: 'Account Management',
            description: 'Generate keypairs and check account information',
          },
          blockchainMonitoring: {
            title: 'Blockchain Monitoring',
            description: 'Monitor blocks, transactions, and network status',
          },
          assetManagement: {
            title: 'Asset Management',
            description: 'Create and manage namespaces and mosaics',
          },
          developmentSupport: {
            title: 'Development Support',
            description: 'Development support tools for payload creation and fee calculation',
          },
        },
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: 'ja', // デフォルト言語
    debug: false,

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
