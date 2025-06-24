# Chiliz Agent Kit

A production-ready TypeScript SDK for interacting with the Chiliz blockchain.

## Features

- 🔒 Secure transaction signing and private key management
- 🌐 Robust RPC and WebSocket provider handling
- 📝 Smart contract interactions with type safety
- 🎯 Real-time event monitoring
- 📊 Comprehensive blockchain data querying
- 🔍 Detailed logging and error tracking

## Installation

```bash
npm install chiliz-agent-kit ethers@6
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

const agent = new ChilizAgent();

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

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT 