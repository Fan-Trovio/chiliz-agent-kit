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

  /**
   * Send ERC-20 tokens (fan tokens) to a recipient.
   * @param tokenAddress The contract address of the ERC-20 token
   * @param to The recipient address
   * @param amount The amount to send (as a string, in whole tokens, e.g. '1.5')
   * @param decimals (optional) The number of decimals for the token (default: 18)
   * @returns The transaction hash
   */
  async sendERC20(tokenAddress: string, to: string, amount: string, decimals: number = 18): Promise<string> {
    try {
      // Minimal ERC-20 ABI for transfer
      const ERC20_ABI = [
        "function transfer(address to, uint256 amount) public returns (bool)",
        "function decimals() public view returns (uint8)",
        "function balanceOf(address) view returns (uint256)"
      ];
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.signer);
      // Optionally fetch decimals from contract if not provided
      let tokenDecimals = decimals;
      if (decimals === undefined || decimals === null) {
        try {
          tokenDecimals = await contract.decimals();
        } catch (e) {
          tokenDecimals = 18; // fallback
        }
      }
      const value = ethers.utils.parseUnits(amount, tokenDecimals);
      const sender = await this.signer.getAddress();
      const balance = await contract.balanceOf(sender);
      console.log('[sendERC20] Sender:', sender);
      console.log('[sendERC20] Recipient:', to);
      console.log('[sendERC20] Token address:', tokenAddress);
      console.log('[sendERC20] Decimals:', tokenDecimals);
      console.log('[sendERC20] Amount to send (raw):', value.toString());
      console.log('[sendERC20] Amount to send (formatted):', amount);
      console.log('[sendERC20] Balance (raw):', balance.toString());
      console.log('[sendERC20] Balance (formatted):', ethers.utils.formatUnits(balance, tokenDecimals));
      if (balance.lt(value)) {
        throw new Error('Insufficient token balance');
      }
      const tx = await contract.transfer(to, value);
      Logger.info('ERC20 transfer sent', {
        hash: tx.hash,
        token: tokenAddress,
        from: sender,
        to,
        amount,
        tokenDecimals
      });
      const receipt = await tx.wait();
      if (receipt?.status === 0) {
        throw new Error('ERC20 token transfer failed');
      }
      return tx.hash;
    } catch (error) {
      Logger.error('Failed to send ERC20 token', { error, tokenAddress, to, amount });
      throw error;
    }
  }

  /**
   * Get the balance of an ERC-20 token (fan token) for a given address.
   * @param tokenAddress The contract address of the ERC-20 token
   * @param address (optional) The address to check balance for (defaults to signer's address)
   * @returns The formatted token balance as a string
   */
  async getTokenBalance(tokenAddress: string, address?: string): Promise<string> {
    try {
      const ERC20_ABI = [
        "function balanceOf(address account) view returns (uint256)",
        "function decimals() view returns (uint8)"
      ];
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, this.provider);
      const targetAddress = address || await this.signer.getAddress();
      const [rawBalance, decimals] = await Promise.all([
        contract.balanceOf(targetAddress),
        contract.decimals()
      ]);
      return ethers.utils.formatUnits(rawBalance, decimals);
    } catch (error) {
      Logger.error('Failed to fetch ERC20 token balance', { error, tokenAddress, address });
      throw error;
    }
  }
} 