import { ethers } from 'ethers';
import { TransactionService } from '../services/transaction';
import { ContractService } from '../services/contract';
import { EventsService } from '../services/events';
import { DataFetcherService } from '../services/data-fetcher';
import { Logger } from '../utils/logger';

interface AgentConfig {
  privateKey: string;
  rpcUrl: string;
}

export class ChilizAgent {
  private provider!: ethers.providers.JsonRpcProvider;
  private signer!: ethers.Wallet;
  
  public transaction!: TransactionService;
  public contract!: ContractService;
  public events!: EventsService;
  public data!: DataFetcherService;

  private constructor() {}

  static async create(config: AgentConfig): Promise<ChilizAgent> {
    const agent = new ChilizAgent();
    await agent.initialize(config);
    return agent;
  }

  public get address(): string {
    return this.signer.address;
  }

  private async initialize(config: AgentConfig) {
    if (!config.privateKey || !config.rpcUrl) {
      throw new Error('privateKey and rpcUrl are required in config');
    }

    // Use StaticJsonRpcProvider with explicit chainId for Chiliz testnet
    this.provider = new ethers.providers.StaticJsonRpcProvider(config.rpcUrl, 88882);
    console.log('[ChilizAgent] Using StaticJsonRpcProvider with chainId:', 88882);
    this.signer = new ethers.Wallet(config.privateKey, this.provider);

    this.transaction = new TransactionService(this.signer);
    this.contract = new ContractService(this.signer);
    this.events = new EventsService(this.provider);
    this.data = new DataFetcherService(this.provider);

    // Optionally, you can still log the network info if needed
    const network = await this.provider.getNetwork();
    Logger.info('ChilizAgent initialized', {
      chainId: network.chainId,
      address: this.signer.address
    });
  }

  async getChainId(): Promise<number> {
    const network = await this.provider.getNetwork();
    return network.chainId;
  }

  async getGasPrice(): Promise<ethers.BigNumber> {
    return this.provider.getGasPrice();
  }

  async estimateGas(tx: ethers.providers.TransactionRequest): Promise<ethers.BigNumber> {
    return this.provider.estimateGas(tx);
  }

  async signMessage(message: string): Promise<string> {
    return this.signer.signMessage(message);
  }

  async verifyMessage(message: string, signature: string): Promise<string> {
    return ethers.utils.verifyMessage(message, signature);
  }

  async close(): Promise<void> {
    try {
      // No destroy method in ethers v5 provider, so just log
      Logger.info('ChilizAgent closed');
    } catch (error) {
      Logger.error('Error while closing ChilizAgent', { error });
      throw error;
    }
  }
} 