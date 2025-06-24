import { ethers } from 'ethers';
import { Logger } from '../utils/logger';

export class ContractService {
  private provider: ethers.providers.Provider;
  private signer: ethers.Signer;

  public constructor(signer: ethers.Signer) {
    this.signer = signer;
    if (!signer.provider) {
      throw new Error("Signer must be connected to a provider.");
    }
    this.provider = signer.provider;
  }

  getSigner(): ethers.Signer {
    return this.signer;
  }

  async getContract(address: string, abi: any): Promise<ethers.Contract> {
    return new ethers.Contract(address, abi, this.signer);
  }

  async getContractWithProvider(address: string, abi: any): Promise<ethers.Contract> {
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
    options: ethers.providers.TransactionRequest = {}
  ): Promise<ethers.providers.TransactionResponse> {
    try {
      const tx = await contract[method](...args, options);
      Logger.info('Contract transaction sent', {
        hash: tx.hash,
        address: contract.address,
        method,
        args
      });
      return tx;
    } catch (error) {
      Logger.error('Contract transaction failed', {
        error,
        address: contract.address,
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
    options: ethers.providers.TransactionRequest = {}
  ): Promise<ethers.BigNumber> {
    try {
      const gas = await contract.estimateGas[method](...args, options);
      return gas;
    } catch (error) {
      Logger.error('Gas estimation failed', {
        error,
        address: contract.address,
        method,
        args
      });
      throw error;
    }
  }
} 