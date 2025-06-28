# Chiliz Agent Kit

[![npm version](https://img.shields.io/npm/v/chiliz-agent-kit.svg)](https://www.npmjs.com/package/chiliz-agent-kit)
[![npm downloads](https://img.shields.io/npm/dw/chiliz-agent-kit.svg)](https://www.npmjs.com/package/chiliz-agent-kit)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## 🚀 Quick Start (2 minutes)

**Want to get started immediately?** Here's the fastest way:

```bash
# 1. Install the package
npm install chiliz-agent-kit ethers@5

# 2. Create a .env file
echo "CHILIZ_RPC_URL=https://rpc.chiliz.com
PRIVATE_KEY=your-private-key-here" > .env

# 3. Create a test file
```

```typescript
// test.js
import { ChilizAgent } from 'chiliz-agent-kit';
import { config } from 'dotenv';

config(); // Load .env file

async function test() {
  const agent = await ChilizAgent.create({
    rpcUrl: process.env.CHILIZ_RPC_URL!,
    privateKey: process.env.PRIVATE_KEY!
  });
  
  const balance = await agent.transaction.getBalance();
  console.log('Your CHZ balance:', balance);
}

test();
```

**That's it!** You now have a working Chiliz blockchain connection. Read on for more details.

---

## 📖 What is Chiliz Agent Kit?

The **Chiliz Agent Kit** is a TypeScript SDK designed specifically for interacting with the **Chiliz blockchain ecosystem**. Think of it as your Swiss Army knife for building blockchain applications on Chiliz.

### What is Chiliz?
- **Chiliz (CHZ)** is a blockchain platform focused on sports and entertainment
- It powers fan tokens for major sports teams (PSG, Juventus, etc.)
- The native cryptocurrency is **CHZ**
- It's like Ethereum but specifically for sports and entertainment

### What does this SDK do?
- **Send CHZ** to other addresses
- **Send fan tokens** (like PSG, JUV tokens) to other users
- **Interact with smart contracts** on the Chiliz blockchain
- **Monitor blockchain events** in real-time
- **Query blockchain data** (balances, transactions, etc.)
- **Integrate with AI** using LangChain for automated operations

---

## ✨ Key Features

- 🔒 **Secure**: Built-in security best practices and private key management
- 🚀 **Fast**: Optimized for the Chiliz network with robust RPC handling
- 🛠️ **Easy**: Simple API, great for beginners and experts alike
- 🌐 **Universal**: Works in both Node.js and browser environments
- 📊 **Comprehensive**: Everything you need for blockchain applications
- 🎯 **Real-time**: Monitor blockchain events as they happen
- 📝 **Type-safe**: Full TypeScript support with smart contract interactions
- 🔍 **Detailed**: Comprehensive logging and error tracking

---

## 🛠️ Installation

```bash
npm install chiliz-agent-kit ethers@5
```

**For TypeScript projects:**
```bash
npm install --save-dev @types/node
```

---

## 🏗️ Basic Usage

### 1. Environment Setup

Create a `.env` file in your project root:

```env
CHILIZ_RPC_URL=https://rpc.chiliz.com
PRIVATE_KEY=your-private-key-here
```

**⚠️ Security Warning**: Never commit your `.env` file to version control! Add it to `.gitignore`.

### 2. Initialize the Agent

```typescript
import { ChilizAgent } from 'chiliz-agent-kit';
import { config } from 'dotenv';

config(); // Load environment variables

const agent = await ChilizAgent.create({
  rpcUrl: process.env.CHILIZ_RPC_URL!,
  privateKey: process.env.PRIVATE_KEY!
});

console.log('Your wallet address:', agent.address);
```

### 3. Send Transactions

```typescript
// Send native CHZ
const txHash = await agent.transaction.sendCHZ('0xRecipientAddress', '1.5');
console.log('CHZ sent! Transaction hash:', txHash);

// Send fan tokens (ERC-20)
const fanTokenTx = await agent.transaction.sendERC20(
  '0xFanTokenContractAddress',  // Token contract
  '0xRecipientAddress',         // Recipient
  '10.5'                        // Amount
);
console.log('Fan token sent! Transaction hash:', fanTokenTx);
```

### 4. Check Balances

```typescript
// Check CHZ balance
const chzBalance = await agent.transaction.getBalance();
console.log('Your CHZ balance:', chzBalance);

// Check fan token balance
const tokenBalance = await agent.transaction.getTokenBalance('0xFanTokenContractAddress');
console.log('Your token balance:', tokenBalance);
```

### 5. Interact with Smart Contracts

```typescript
// Get contract instance
const contract = await agent.contract.getContract(
  '0xContractAddress',
  ['function balanceOf(address) view returns (uint256)']
);

// Read contract data
const balance = await agent.contract.callMethod(contract, 'balanceOf', [agent.address]);
console.log('Contract balance:', balance.toString());
```

### 6. Monitor Events

```typescript
// Listen to real-time events
await agent.events.subscribeToEvents(
  contract,
  'Transfer',
  (event) => {
    console.log('Transfer happened!', {
      from: event.args.from,
      to: event.args.to,
      value: event.args.value.toString()
    });
  }
);
```

### 7. Query Blockchain Data

```typescript
// Get latest block
const block = await agent.data.getLatestBlock();
console.log('Latest block:', block.number);

// Get transaction receipt
const receipt = await agent.data.getTransactionReceipt(txHash);
console.log('Transaction status:', receipt?.status === 1 ? 'Success' : 'Failed');
```

---

## 🌐 Browser Support

The SDK works in both Node.js and browser environments (Next.js, React, etc.).

### Browser Setup

```typescript
// Add polyfill for setImmediate if needed
if (typeof window !== "undefined" && typeof window.setImmediate === "undefined") {
  window.setImmediate = (fn: (...args: any[]) => void, ...args: any[]) => 
    setTimeout(fn, 0, ...args);
}

// Initialize agent in browser
const agent = await ChilizAgent.create({
  rpcUrl: 'https://rpc.chiliz.com',
  privateKey: 'your-private-key'
});
```

**⚠️ Important Security Note**: Never use real private keys in browser code for production! Instead, use MetaMask, WalletConnect, or other wallet providers for user authentication.

---

## 🤖 AI Integration with LangChain

Create AI-powered blockchain agents:

```typescript
import { getChilizTools } from 'chiliz-agent-kit/langchain';

// Define available tokens
const tokenMap = {
  PSG: { address: '0xPSGTokenAddress', decimals: 18 },
  JUV: { address: '0xJUVTokenAddress', decimals: 18 }
};

// Create AI tools
const tools = getChilizTools(agent, tokenMap);

// Use with LangChain agent
const result = await agent.invoke({
  input: "Send 5 PSG tokens to 0xRecipientAddress"
});
```

---

## 🏗️ Architecture

The SDK is organized into modular services:

- **`TransactionService`**: Handle CHZ and fan token transfers
- **`ContractService`**: Interact with smart contracts
- **`EventsService`**: Subscribe to and query blockchain events
- **`DataFetcherService`**: Query blockchain data and state

---

## ⚠️ Error Handling

Custom error classes for better error management:

```typescript
import { TransactionError, ContractError, NetworkError, ValidationError } from 'chiliz-agent-kit';

try {
  await agent.transaction.sendCHZ('0xRecipientAddress', '1.0');
} catch (error) {
  if (error instanceof TransactionError) {
    console.error('Transaction failed:', error.message);
    console.error('Transaction hash:', error.txHash);
  } else if (error instanceof ValidationError) {
    console.error('Invalid input:', error.message);
  } else if (error instanceof NetworkError) {
    console.error('Network problem:', error.message);
  }
}
```

---

## 🔧 Troubleshooting

### Common Issues

1. **"setImmediate is not defined"** → Add the browser polyfill shown above
2. **"Missing environment variables"** → Check your `.env` file and `config()` call
3. **"Transaction failed"** → Check your balance and gas fees
4. **"Insufficient token balance"** → Verify you have enough tokens

### Performance Tips

- Reuse the agent instance instead of creating new ones
- Batch operations when possible
- Monitor gas prices before sending transactions

---

## 🛠️ Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run linter
npm run lint

# Watch for changes
npm run watch
```

---

## 📋 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `CHILIZ_RPC_URL` | Chiliz RPC endpoint | ✅ Yes |
| `PRIVATE_KEY` | Your private key | ✅ Yes |
| `CHILIZ_WS_URL` | WebSocket endpoint | ❌ Optional |
| `LOG_LEVEL` | Logging level (default: 'info') | ❌ Optional |
| `LOG_FORMAT` | Log format ('json' or 'text') | ❌ Optional |

---

## 📚 Documentation & Resources

- **📖 Full Documentation**: [DOCUMENTATION.md](./DOCUMENTATION.md)
- **🌐 Chiliz Official**: [chiliz.com](https://chiliz.com)
- **🔍 Chiliz Explorer**: [scan.chiliz.com](https://scan.chiliz.com)
- **📦 NPM Package**: [npmjs.com/package/chiliz-agent-kit](https://npmjs.com/package/chiliz-agent-kit)

---

## 🤝 Contributing

We welcome contributions from the community!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a new Pull Request

Please open issues for bugs, questions, or feature requests.

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

**Ready to build on Chiliz?** Start with the [Quick Start](#-quick-start-2-minutes) above and check out the [full documentation](./DOCUMENTATION.md) for advanced features!
