export interface CommonTranslation {
  menu: {
    home: string;
    keypair: string;
    account: string;
    monitor: string;
    namespace: string;
    mosaic: string;
    block: string;
    transaction: string;
    node: string;
    network: string;
    payload: string;
    fee: string;
  };
  home: {
    title: string;
    subtitle: string;
    meta: {
      title: string;
      description: string;
    };
    categories: {
      accountManagement: {
        title: string;
        description: string;
      };
      blockchainMonitoring: {
        title: string;
        description: string;
      };
      assetManagement: {
        title: string;
        description: string;
      };
      developmentSupport: {
        title: string;
        description: string;
      };
    };
  };
}

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: CommonTranslation;
    };
  }
}
