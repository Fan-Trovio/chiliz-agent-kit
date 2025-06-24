import { ethers } from 'ethers';
import { ChilizProvider } from '../core/provider';
import { ChilizSigner } from '../core/signer';
import { Logger } from '../utils/logger';

export class ContractService {
  private provider!: ethers.JsonRpcProvider;
  private signer!: ethers.Wallet;

  private constructor() {}

  static async create(): Promise<ContractService> {
    const service = new ContractService();
    await service.initialize();
    return service;
  }

  private async initialize() {
    this.provider = await ChilizProvider.getRpcProvider();
    this.signer = await ChilizSigner.getSigner();
  }

  async getSigner(): Promise<ethers.Wallet> {
    return ChilizSigner.getSigner();
  }

  async getContract(address: string, abi: ethers.InterfaceAbi): Promise<ethers.Contract> {
    return new ethers.Contract(address, abi, this.signer);
  }

  async getContractWithProvider(address: string, abi: ethers.InterfaceAbi): Promise<ethers.Contract> {
    return new ethers.Contract(address, abi, this.provider);
  }

  async callMethod(
    contract: ethers.Contract,
    method: string,
    args: any[] = []
  ): Promise<any> {
    try {
      const result = await contract[method](...args);
      Logger.info('Contract method called', {
        address: contract.target,
        method,
        args
      });
      return result;
    } catch (error) {
      Logger.error('Contract method call failed', {
        error,
        address: contract.target,
        method,
        args
      });
      throw error;
    }
  }

  async sendTransaction(
    contract: ethers.Contract,
    method: string,
    args: any[] = [],
    options: ethers.TransactionRequest = {}
  ): Promise<ethers.TransactionResponse> {
    try {
      const tx = await contract[method](...args, options);
      Logger.info('Contract transaction sent', {
        hash: tx.hash,
        address: contract.target,
        method,
        args
      });
      return tx;
    } catch (error) {
      Logger.error('Contract transaction failed', {
        error,
        address: contract.target,
        method,
        args
      });
      throw error;
    }
  }

  async estimateGas(
    contract: ethers.Contract,
    method: string,
    args: any[] = [],
    options: ethers.TransactionRequest = {}
  ): Promise<bigint> {
    try {
      const gas = await contract[method].estimateGas(...args, options);
      return gas;
    } catch (error) {
      Logger.error('Gas estimation failed', {
        error,
        address: contract.target,
        method,
        args
      });
      throw error;
    }
  }
} 