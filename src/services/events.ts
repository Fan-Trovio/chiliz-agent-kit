import { ethers } from 'ethers';
import { ChilizProvider } from '../core/provider';
import { Logger } from '../utils/logger';

export class EventsService {
  private provider!: ethers.JsonRpcProvider;

  private constructor() {}

  static async create(): Promise<EventsService> {
    const service = new EventsService();
    await service.initialize();
    return service;
  }

  private async initialize() {
    this.provider = await ChilizProvider.getRpcProvider();
  }

  async subscribeToEvents(
    contract: ethers.Contract,
    eventName: string,
    callback: (event: ethers.EventLog) => void,
    filter: any = {}
  ): Promise<void> {
    try {
      contract.on(eventName, (...args) => {
        const event = args[args.length - 1] as ethers.EventLog;
        Logger.info('Event received', {
          address: contract.target,
          eventName,
          args: event.args
        });
        callback(event);
      });

      Logger.info('Subscribed to event', {
        address: contract.target,
        eventName,
        filter
      });
    } catch (error) {
      Logger.error('Failed to subscribe to event', {
        error,
        address: contract.target,
        eventName
      });
      throw error;
    }
  }

  async getPastEvents(
    contract: ethers.Contract,
    eventName: string,
    filter: any = {},
    fromBlock: number = 0,
    toBlock: number | string = 'latest'
  ): Promise<ethers.EventLog[]> {
    try {
      const events = await contract.queryFilter(
        contract.filters[eventName](filter),
        fromBlock,
        toBlock
      );

      Logger.info('Retrieved past events', {
        address: contract.target,
        eventName,
        count: events.length,
        fromBlock,
        toBlock
      });

      return events as ethers.EventLog[];
    } catch (error) {
      Logger.error('Failed to get past events', {
        error,
        address: contract.target,
        eventName,
        fromBlock,
        toBlock
      });
      throw error;
    }
  }

  async unsubscribeFromEvents(
    contract: ethers.Contract,
    eventName?: string
  ): Promise<void> {
    try {
      if (eventName) {
        contract.off(eventName);
        Logger.info('Unsubscribed from event', {
          address: contract.target,
          eventName
        });
      } else {
        contract.removeAllListeners();
        Logger.info('Unsubscribed from all events', {
          address: contract.target
        });
      }
    } catch (error) {
      Logger.error('Failed to unsubscribe from events', {
        error,
        address: contract.target,
        eventName
      });
      throw error;
    }
  }
} 