export namespace Chiliz {
  export interface NetworkConfig {
    chainId: number;
    name: string;
    rpcUrl: string;
    wsUrl?: string;
    explorerUrl: string;
  }

  export interface Networks {
    mainnet: NetworkConfig;
    testnet: NetworkConfig;
  }

  export const networks: Networks = {
    mainnet: {
      chainId: 88888,
      name: 'Chiliz Chain',
      rpcUrl: 'https://rpc.chiliz.com',
      explorerUrl: 'https://scan.chiliz.com'
    },
    testnet: {
      chainId: 88882,
      name: 'Chiliz Chain Testnet',
      rpcUrl: 'https://spicy-rpc.chiliz.com',
      explorerUrl: 'https://testnet.chiliscan.com'
    }
  };

  export interface TransactionConfig {
    gasLimit?: number;
    maxFeePerGas?: string;
    maxPriorityFeePerGas?: string;
    nonce?: number;
    topics?: Array<string | Array<string> | null>;
  }

  export interface ContractConfig {
    address: string;
    abi: any[];
  }

  export interface EventFilter {
    fromBlock?: number | string;
    toBlock?: number | string;
    address?: string;
    topics?: Array<string | Array<string> | null>;
  }
} 