import { ethers } from 'ethers';

export namespace Contracts {
  export interface ContractEventLog extends ethers.EventLog {
    args: ethers.Result;
  }

  export interface ContractError extends Error {
    code: string;
    reason?: string;
    transaction?: ethers.TransactionResponse;
    receipt?: ethers.TransactionReceipt;
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
    getDeployTransaction(...args: any[]): ethers.TransactionRequest;
  }

  export interface ContractInterface extends ethers.Interface {
    functions: Record<string, ethers.FunctionFragment>;
    events: Record<string, ethers.EventFragment>;
    errors: Record<string, ethers.ErrorFragment>;
  }

  export interface ContractReceipt extends ethers.TransactionReceipt {
    events?: Array<ContractEventLog>;
  }
} 