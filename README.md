# Chiliz Agent Kit

[![npm version](https://img.shields.io/npm/v/chiliz-agent-kit.svg)](https://www.npmjs.com/package/chiliz-agent-kit)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

A modern, open source TypeScript SDK for interacting with the Chiliz blockchain.

## Features

- 🔒 Secure transaction signing and private key management (Node.js & browser)
- 🌐 Robust RPC provider handling (ethers v5)
- 📝 Smart contract interactions with type safety
- 🎯 Real-time event monitoring
- 📊 Comprehensive blockchain data querying
- 🔍 Detailed logging and error tracking

## Installation

```bash
npm install chiliz-agent-kit ethers@5
```

## Quick Start

1. Create a `.env` file:

```env
CHILIZ_RPC_URL=https://rpc.chiliz.com
PRIVATE_KEY=your-private-key-here
```

2. Initialize the agent:

```typescript
import { ChilizAgent } from 'chiliz-agent-kit';

const agent = await ChilizAgent.create({
  rpcUrl: process.env.CHILIZ_RPC_URL!,
  privateKey: process.env.PRIVATE_KEY!,
});

// Send CHZ
await agent.transaction.sendCHZ('0x...', '100');

// Interact with contracts
const contract = await agent.contract.getContract(address, abi);
await contract.someMethod();

// Listen to events
agent.events.subscribeToEvents(contract, 'Transfer', (event) => {
  console.log('Transfer:', event.args);
});

// Query blockchain data
const block = await agent.data.getLatestBlock();
console.log('Latest block:', block.number);
```

## Browser Support

- The SDK works in both Node.js and browser (Next.js, React, etc.) environments.
- **Security warning:** Never expose real private keys in production browser apps. For dApps, use MetaMask or WalletConnect for user authentication.
- If you see `setImmediate is not defined`, add this polyfill at the top of your entry file:

```js
if (typeof window !== "undefined" && typeof window.setImmediate === "undefined") {
  // @ts-ignore
  window.setImmediate = (fn: (...args: any[]) => void, ...args: any[]) => setTimeout(fn, 0, ...args);
}
```

## Architecture

The SDK is organized into modular services:

- `TransactionService`: Handle CHZ transfers and transaction management
- `ContractService`: Interact with smart contracts
- `EventsService`: Subscribe to and query blockchain events
- `DataFetcherService`: Query blockchain data and state

## Error Handling

Custom error classes for better error management:

```typescript
try {
  await agent.transaction.sendCHZ('0x...', '100');
} catch (error) {
  if (error instanceof TransactionError) {
    console.error('Transaction failed:', error.message);
    console.error('TX Hash:', error.txHash);
  }
}
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run linter
npm run lint
```

## Environment Variables

- `CHILIZ_RPC_URL`: Chiliz RPC endpoint
- `CHILIZ_WS_URL`: (Optional) WebSocket endpoint
- `PRIVATE_KEY`: Your private key
- `LOG_LEVEL`: Logging level (default: 'info')
- `LOG_FORMAT`: Log format ('json' or 'text')

## Contributing

We welcome contributions from the community!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a new Pull Request

Please open issues for bugs, questions, or feature requests.

## License

MIT — see [LICENSE](LICENSE) for details. 