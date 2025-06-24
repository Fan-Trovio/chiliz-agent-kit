import { ethers } from 'ethers';
import { getConfig } from '../utils/config';
import { Logger } from '../utils/logger';

export class ChilizProvider {
  private static rpcInstance: ethers.JsonRpcProvider;
  private static wsInstance: ethers.WebSocketProvider;
  private static readonly defaultChainId = 88888;

  static async getRpcProvider(): Promise<ethers.JsonRpcProvider> {
    if (!this.rpcInstance) {
      const rpcUrl = getConfig('CHILIZ_RPC_URL');
      this.rpcInstance = new ethers.JsonRpcProvider(rpcUrl);
      
      // Verify connection and chain ID
      try {
        const network = await this.rpcInstance.getNetwork();
        const chainId = Number(network.chainId);
        
        if (chainId !== this.defaultChainId) {
          Logger.warn(`Connected to chain ID ${chainId}, expected ${this.defaultChainId}`);
        }
      } catch (error) {
        Logger.error('Failed to initialize RPC provider', { error });
        throw error;
      }
    }
    return this.rpcInstance;
  }

  static async getWsProvider(): Promise<ethers.WebSocketProvider> {
    if (!this.wsInstance) {
      const wsUrl = getConfig('CHILIZ_WS_URL');
      this.wsInstance = new ethers.WebSocketProvider(wsUrl);
      
      // Setup reconnection logic
      this.wsInstance.on('error', (error) => {
        Logger.error('WebSocket provider error', { error });
        this.wsInstance = null as any;
      });
    }
    return this.wsInstance;
  }

  static async getTestnetProvider(): Promise<ethers.JsonRpcProvider> {
    const testnetUrl = getConfig('CHILIZ_TESTNET_RPC_URL');
    return new ethers.JsonRpcProvider(testnetUrl);
  }
} 