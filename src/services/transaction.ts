import { ethers } from 'ethers';
import { Logger } from '../utils/logger';

export class TransactionService {
  private provider: ethers.providers.Provider;
  private signer: ethers.Signer;

  public constructor(signer: ethers.Signer) {
    this.signer = signer;
    if (!signer.provider) {
      throw new Error("Signer must be connected to a provider.");
    }
    this.provider = signer.provider;
  }

  async sendCHZ(to: string, amount: string): Promise<string> {
    try {
      const value = ethers.utils.parseEther(amount);
      const nonce = await this.signer.getTransactionCount();
      
      const tx = await this.signer.sendTransaction({
        to,
        value,
        nonce,
        gasLimit: 21000 // Standard ETH transfer gas limit
      });

      Logger.info('Transaction sent', { 
        hash: tx.hash,
        from: await this.signer.getAddress(),
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
    const targetAddress = address || await this.signer.getAddress();
    const balance = await this.provider.getBalance(targetAddress);
    return ethers.utils.formatEther(balance);
  }

  async waitForTransaction(txHash: string, confirmations = 1): Promise<ethers.providers.TransactionReceipt | null> {
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