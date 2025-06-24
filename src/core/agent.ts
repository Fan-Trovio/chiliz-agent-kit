import { ethers } from 'ethers';
import { ChilizProvider } from './provider';
import { ChilizSigner } from './signer';
import { TransactionService } from '../services/transaction';
import { ContractService } from '../services/contract';
import { EventsService } from '../services/events';
import { DataFetcherService } from '../services/data-fetcher';
import { Logger } from '../utils/logger';
import { validateConfig } from '../utils/config';

export class ChilizAgent {
  private provider!: ethers.JsonRpcProvider;
  private signer!: ethers.Wallet;
  
  public transaction!: TransactionService;
  public contract!: ContractService;
  public events!: EventsService;
  public data!: DataFetcherService;

  private constructor() {
    // Do not instantiate services here; they are initialized in create()
  }

  static async create(): Promise<ChilizAgent> {
    const agent = new ChilizAgent();
    await agent.initialize();
    agent.transaction = await TransactionService.create();
    agent.contract = await ContractService.create();
    agent.events = await EventsService.create();
    agent.data = await DataFetcherService.create();
    return agent;
  }

  private async initialize() {
    try {
      // Validate environment configuration
      validateConfig();

      // Initialize provider and signer
      this.provider = await ChilizProvider.getRpcProvider();
      this.signer = await ChilizSigner.getSigner();

      const network = await this.provider.getNetwork();
      Logger.info('ChilizAgent initialized', {
        chainId: network.chainId,
        address: this.signer.address
      });
    } catch (error) {
      Logger.error('Failed to initialize ChilizAgent', { error });
      throw error;
    }
  }

  async getChainId(): Promise<bigint> {
    const network = await this.provider.getNetwork();
    return network.chainId;
  }

  async getGasPrice(): Promise<bigint> {
    return this.provider.getFeeData().then(data => data.gasPrice || 0n);
  }

  async estimateGas(tx: ethers.TransactionRequest): Promise<bigint> {
    return this.provider.estimateGas(tx);
  }

  async signMessage(message: string): Promise<string> {
    return this.signer.signMessage(message);
  }

  async verifyMessage(message: string, signature: string): Promise<string> {
    return ethers.verifyMessage(message, signature);
  }

  async close(): Promise<void> {
    try {
      // Cleanup any active listeners or connections
      await this.provider.destroy();
      Logger.info('ChilizAgent closed');
    } catch (error) {
      Logger.error('Error while closing ChilizAgent', { error });
      throw error;
    }
  }
} 