import { ethers } from 'ethers';
import { Logger } from '../utils/logger';

export class DataFetcherService {
  private provider: ethers.providers.Provider;

  public constructor(provider: ethers.providers.Provider) {
    this.provider = provider;
  }

  async getLatestBlock(): Promise<ethers.providers.Block> {
    try {
      const block = await this.provider.getBlock('latest');
      if (!block) throw new Error('Failed to fetch latest block');
      
      Logger.info('Latest block fetched', {
        number: block.number,
        hash: block.hash,
        timestamp: block.timestamp
      });
      
      return block;
    } catch (error) {
      Logger.error('Failed to fetch latest block', { error });
      throw error;
    }
  }

  async getBlockByNumber(blockNumber: number): Promise<ethers.providers.Block> {
    try {
      const block = await this.provider.getBlock(blockNumber);
      if (!block) throw new Error(`Block ${blockNumber} not found`);
      
      Logger.info('Block fetched', {
        number: block.number,
        hash: block.hash,
        timestamp: block.timestamp
      });
      
      return block;
    } catch (error) {
      Logger.error('Failed to fetch block', { error, blockNumber });
      throw error;
    }
  }

  async getTransactionReceipt(txHash: string): Promise<ethers.providers.TransactionReceipt | null> {
    try {
      const receipt = await this.provider.getTransactionReceipt(txHash);
      
      if (receipt) {
        Logger.info('Transaction receipt fetched', {
          hash: receipt.transactionHash,
          blockNumber: receipt.blockNumber,
          status: receipt.status
        });
      } else {
        Logger.warn('Transaction receipt not found', { txHash });
      }
      
      return receipt;
    } catch (error) {
      Logger.error('Failed to fetch transaction receipt', { error, txHash });
      throw error;
    }
  }

  async getCode(address: string): Promise<string> {
    try {
      const code = await this.provider.getCode(address);
      
      Logger.info('Contract code fetched', {
        address,
        bytecodeLength: code.length
      });
      
      return code;
    } catch (error) {
      Logger.error('Failed to fetch contract code', { error, address });
      throw error;
    }
  }

  async getStorageAt(
    address: string,
    position: string,
    blockTag: number | string = 'latest'
  ): Promise<string> {
    try {
      const storage = await this.provider.getStorageAt(address, position, blockTag);
      
      Logger.info('Storage slot fetched', {
        address,
        position,
        blockTag,
        value: storage
      });
      
      return storage;
    } catch (error) {
      Logger.error('Failed to fetch storage', {
        error,
        address,
        position,
        blockTag
      });
      throw error;
    }
  }
} 