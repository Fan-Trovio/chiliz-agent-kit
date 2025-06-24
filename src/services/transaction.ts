import { ethers } from 'ethers';
import { ChilizProvider } from '../core/provider';
import { ChilizSigner } from '../core/signer';
import { Logger } from '../utils/logger';

export class TransactionService {
  private provider!: ethers.JsonRpcProvider;
  private signer!: ethers.Wallet;

  private constructor() {}

  static async create(): Promise<TransactionService> {
    const service = new TransactionService();
    await service.initialize();
    return service;
  }

  private async initialize() {
    this.provider = await ChilizProvider.getRpcProvider();
    this.signer = await ChilizSigner.getSigner();
  }

  async sendCHZ(to: string, amount: string): Promise<string> {
    try {
      const value = ethers.parseEther(amount);
      const nonce = await this.signer.getNonce();
      
      const tx = await this.signer.sendTransaction({
        to,
        value,
        nonce,
        gasLimit: 21000 // Standard ETH transfer gas limit
      });

      Logger.info('Transaction sent', { 
        hash: tx.hash,
        from: this.signer.address,
        to,
        amount,
        nonce
      });

      const receipt = await tx.wait();
      
      if (receipt?.status === 0) {
        throw new Error('Transaction failed');
      }

      return tx.hash;
    } catch (error) {
      Logger.error('Failed to send CHZ', { error, to, amount });
      throw error;
    }
  }

  async getBalance(address?: string): Promise<string> {
    const targetAddress = address || this.signer.address;
    const balance = await this.provider.getBalance(targetAddress);
    return ethers.formatEther(balance);
  }

  async waitForTransaction(txHash: string, confirmations = 1): Promise<ethers.TransactionReceipt | null> {
    try {
      const receipt = await this.provider.waitForTransaction(txHash, confirmations);
      Logger.info('Transaction confirmed', { 
        hash: txHash, 
        confirmations,
        blockNumber: receipt?.blockNumber
      });
      return receipt;
    } catch (error) {
      Logger.error('Error waiting for transaction', { error, txHash });
      throw error;
    }
  }
} 