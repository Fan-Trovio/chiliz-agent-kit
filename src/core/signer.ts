import { ethers } from 'ethers';
import { getConfig } from '../utils/config';
import { Logger } from '../utils/logger';
import { ChilizProvider } from './provider';

export class ChilizSigner {
  private static instance: ethers.Wallet;

  static async getSigner(): Promise<ethers.Wallet> {
    if (!this.instance) {
      const privateKey = getConfig('PRIVATE_KEY');
      const provider = await ChilizProvider.getRpcProvider();
      
      try {
        this.instance = new ethers.Wallet(privateKey, provider);
        
        // Verify the signer has a balance
        const balance = await provider.getBalance(this.instance.address);
        Logger.info('Signer initialized', { 
          address: this.instance.address,
          balance: ethers.formatEther(balance)
        });
      } catch (error) {
        Logger.error('Failed to initialize signer', { error });
        throw error;
      }
    }
    return this.instance;
  }

  static async signMessage(message: string): Promise<string> {
    const signer = await this.getSigner();
    return signer.signMessage(message);
  }

  static async signTransaction(transaction: ethers.TransactionRequest): Promise<string> {
    const signer = await this.getSigner();
    return signer.signTransaction(transaction);
  }
} 