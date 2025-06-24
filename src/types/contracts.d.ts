import { ethers } from 'ethers';

export namespace Contracts {
  export interface ContractEventLog extends ethers.Event {
    args: ethers.utils.Result;
  }

  export interface ContractError extends Error {
    code: string;
    reason?: string;
    transaction?: ethers.providers.TransactionResponse;
    receipt?: ethers.providers.TransactionReceipt;
  }

  export interface ContractCallOptions {
    from?: string;
    gasLimit?: number;
    gasPrice?: string;
    value?: string;
    nonce?: number;
  }

  export interface ContractDeploymentOptions extends ContractCallOptions {
    data: string;
  }

  export interface ContractFactory {
    deploy(...args: any[]): Promise<ethers.Contract>;
    getDeployTransaction(...args: any[]): ethers.providers.TransactionRequest;
  }

  export interface ContractInterface extends ethers.utils.Interface {
    functions: Record<string, ethers.utils.FunctionFragment>;
    events: Record<string, ethers.utils.EventFragment>;
    errors: Record<string, ethers.utils.ErrorFragment>;
  }

  export interface ContractReceipt extends ethers.providers.TransactionReceipt {
    events?: Array<ContractEventLog>;
  }
} 