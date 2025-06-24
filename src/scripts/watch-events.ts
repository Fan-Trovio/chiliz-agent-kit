import { ethers } from 'ethers';
import { ChilizAgent } from '..';
import { Logger } from '../utils/logger';
import CHZ_ABI from '../../abis/CHZ.json';
import { config } from 'dotenv';

config();

async function watchEvents() {
  try {
    const rpcUrl = process.env.CHILIZ_RPC_URL;
    const privateKey = process.env.PRIVATE_KEY;
    const tokenAddress = process.env.TOKEN_ADDRESS;

    if (!rpcUrl || !privateKey) {
      throw new Error("Missing CHILIZ_RPC_URL or PRIVATE_KEY in .env file for watching events");
    }
    
    const agent = await ChilizAgent.create({ rpcUrl, privateKey });

    if (!tokenAddress) {
      throw new Error('TOKEN_ADDRESS environment variable is required');
    }

    const contract = await agent.contract.getContract(
      tokenAddress,
      CHZ_ABI
    );

    Logger.info('Starting event monitoring...', {
      address: tokenAddress
    });

    // Monitor Transfer events
    agent.events.subscribeToEvents(
      contract,
      'Transfer',
      (event: any) => {
        const { from, to, value } = event.args;
        Logger.info('Transfer detected', {
          from,
          to,
          value: ethers.utils.formatEther(value),
          transactionHash: event.transactionHash
        });
      }
    );

    // Monitor Approval events
    agent.events.subscribeToEvents(
      contract,
      'Approval',
      (event: any) => {
        const { owner, spender, value } = event.args;
        Logger.info('Approval detected', {
          owner,
          spender,
          value: ethers.utils.formatEther(value),
          transactionHash: event.transactionHash
        });
      }
    );

    // Keep the process running
    process.stdin.resume();

    // Handle cleanup
    process.on('SIGINT', async () => {
      Logger.info('Stopping event monitoring...');
      await agent.events.unsubscribeFromEvents(contract);
      process.exit(0);
    });

  } catch (error) {
    Logger.error('Event monitoring failed', { error });
    throw error;
  }
}

// Run the event watcher
if (require.main === module) {
  watchEvents()
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} 