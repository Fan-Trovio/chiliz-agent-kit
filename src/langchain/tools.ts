import { DynamicTool } from 'langchain/tools';
import { ChilizAgent } from '../core/agent';

/**
 * A map of token tickers to their contract addresses and decimals.
 * e.g. { PSG: { address: '0x...', decimals: 18 } }
 */
export interface TokenMap {
  [ticker: string]: { address: string; decimals: number };
}

/**
 * Creates a suite of LangChain tools from an initialized ChilizAgent.
 * @param agent An initialized ChilizAgent instance.
 * @param tokenMap A map of token tickers to their contract addresses and decimals.
 * @returns An array of DynamicTool objects for use with a LangChain agent.
 */
export function getChilizTools(agent: ChilizAgent, tokenMap: TokenMap = {}): DynamicTool[] {
  const availableTickers = Object.keys(tokenMap).join(', ');

  return [
    new DynamicTool({
      name: 'getWalletAddress',
      description: `Returns the agent's wallet address. Input should be an empty string.`,
      func: async () => agent.address,
    }),
    new DynamicTool({
      name: 'getNativeBalance',
      description: `Returns the agent's native CHZ balance. Input should be an empty string.`,
      func: async () => agent.transaction.getBalance(await agent.address),
    }),
    new DynamicTool({
      name: 'getTokenBalance',
      description: `Returns the balance of a specific fan token. Input must be a token ticker. Available tickers: ${availableTickers}`,
      func: async (ticker: string) => {
        const token = tokenMap[ticker.toUpperCase()];
        if (!token) return `Unknown token ticker: ${ticker}. Available tickers are: ${availableTickers}`;
        const balance = await agent.transaction.getTokenBalance(token.address, await agent.address);
        return `${balance} ${ticker.toUpperCase()}`;
      },
    }),
    new DynamicTool({
      name: 'sendNativeCHZ',
      description: 'Sends native CHZ to a recipient. Input must be a comma-separated string of "recipientAddress,amount". For example: "0x123...,1.5"',
      func: async (input: string) => {
        const [to, amount] = input.split(',').map(s => s.trim());
        if (!to || !amount) return 'Invalid input. Expected format: "recipientAddress, amount"';
        const txHash = await agent.transaction.sendCHZ(to, amount);
        return `Transaction sent successfully. Hash: ${txHash}`;
      },
    }),
    new DynamicTool({
        name: 'sendFanToken',
        description: `Sends a fan token to a recipient. Input must be a comma-separated string of "ticker,recipientAddress,amount". For example: "PSG,0x123...,10". Available tickers: ${availableTickers}`,
        func: async (input: string) => {
            const [ticker, to, amount] = input.split(',').map(s => s.trim());
            if (!ticker || !to || !amount) return 'Invalid input. Expected format: "ticker,recipientAddress,amount"';
            const token = tokenMap[ticker.toUpperCase()];
            if (!token) return `Unknown token ticker: ${ticker}. Available tickers are: ${availableTickers}`;
            const txHash = await agent.transaction.sendERC20(token.address, to, amount);
            return `Transaction sent successfully. Hash: ${txHash}`;
        },
    }),
  ];
} 