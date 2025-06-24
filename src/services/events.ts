import { ethers } from 'ethers';
import { Logger } from '../utils/logger';

export class EventsService {
  private provider: ethers.providers.Provider;

  public constructor(provider: ethers.providers.Provider) {
    this.provider = provider;
  }

  async subscribeToEvents(
    contract: ethers.Contract,
    eventName: string,
    callback: (event: ethers.Event) => void,
    filter: any = {}
  ): Promise<void> {
    try {
      contract.on(eventName, (...args) => {
        const event = args[args.length - 1];
        Logger.info('Event received', {
          address: contract.address,
          eventName,
          args: event.args
        });
        callback(event);
      });

      Logger.info('Subscribed to event', {
        address: contract.address,
        eventName,
        filter
      });
    } catch (error) {
      Logger.error('Failed to subscribe to event', {
        error,
        address: contract.address,
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
  ): Promise<ethers.Event[]> {
    try {
      const events = await contract.queryFilter(
        contract.filters[eventName](filter),
        fromBlock,
        toBlock
      );

      Logger.info('Retrieved past events', {
        address: contract.address,
        eventName,
        count: events.length,
        fromBlock,
        toBlock
      });

      return events as ethers.Event[];
    } catch (error) {
      Logger.error('Failed to get past events', {
        error,
        address: contract.address,
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
        contract.removeAllListeners(eventName);
        Logger.info('Unsubscribed from event', {
          address: contract.address,
          eventName
        });
      } else {
        contract.removeAllListeners();
        Logger.info('Unsubscribed from all events', {
          address: contract.address
        });
      }
    } catch (error) {
      Logger.error('Failed to unsubscribe from events', {
        error,
        address: contract.address,
        eventName
      });
      throw error;
    }
  }
} 