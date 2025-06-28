# Chiliz Agent Kit - Complete Documentation

## 🚀 Quick Start (5 minutes)

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

**That's it!** You now have a working Chiliz blockchain connection. Read on for the full guide.

---

## 📖 Overview

The **Chiliz Agent Kit** is a TypeScript SDK designed specifically for interacting with the **Chiliz blockchain ecosystem**. Think of it as your Swiss Army knife for building blockchain applications on Chiliz.

### What does this SDK do?
- **Send CHZ** to other addresses
- **Send fan tokens** (like PSG, JUV tokens) to other users
- **Interact with smart contracts** on the Chiliz blockchain
- **Monitor blockchain events** in real-time
- **Query blockchain data** (balances, transactions, etc.)
- **Integrate with AI** using LangChain for automated operations

### Key Features
- 🔒 **Secure**: Built-in security best practices
- 🚀 **Fast**: Optimized for the Chiliz network
- 🛠️ **Easy**: Simple API, great for beginners
- 🌐 **Universal**: Works in Node.js and browsers
- 📊 **Comprehensive**: Everything you need for blockchain apps
- 🤖 **AI-Powered**: Built-in LangChain integration for intelligent automation

---

## 🏗️ Core Functionality

### 1. ChilizAgent - Your Main Tool

The `ChilizAgent` is like your personal assistant for the Chiliz blockchain. It handles all the complex stuff so you don't have to.

**What it does**: Creates a secure connection to the Chiliz blockchain and gives you access to all the tools you need.

```typescript
import { ChilizAgent } from 'chiliz-agent-kit';

// Initialize your agent (like logging into your account)
const agent = await ChilizAgent.create({
  rpcUrl: 'https://rpc.chiliz.com',  // The Chiliz network address
  privateKey: 'your-private-key-here' // Your secret key (keep this safe!)
});

// Now you can access your wallet info
console.log('Your wallet address:', agent.address);
console.log('Network ID:', await agent.getChainId());
console.log('Current gas price:', await agent.getGasPrice());

// Sign messages (like digital signatures)
const signature = await agent.signMessage('Hello Chiliz!');
const recoveredAddress = await agent.verifyMessage('Hello Chiliz!', signature);
```

### 2. Transaction Service - Send Money & Tokens

This handles all your money transfers - both CHZ and fan tokens.

**What it does**: Sends CHZ, sends fan tokens, checks balances, and waits for transactions to complete.

```typescript
// Send native CHZ (like sending money)
const txHash = await agent.transaction.sendCHZ(
  '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', // Recipient address
  '1.5'  // Amount in CHZ
);
console.log('CHZ sent! Transaction hash:', txHash);

// Send fan tokens (like PSG, JUV tokens)
const fanTokenTx = await agent.transaction.sendERC20(
  '0xFanTokenContractAddress',  // Token contract address
  '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',  // Recipient
  '10.5',  // Amount
  18  // Token decimals (usually 18)
);
console.log('Fan token sent! Transaction hash:', fanTokenTx);

// Check your balances
const chzBalance = await agent.transaction.getBalance();
const tokenBalance = await agent.transaction.getTokenBalance(
  '0xFanTokenContractAddress'
);
console.log('Your CHZ balance:', chzBalance);
console.log('Your token balance:', tokenBalance);

// Wait for a transaction to be confirmed
const receipt = await agent.transaction.waitForTransaction(txHash, 3);
console.log('Transaction confirmed in block:', receipt?.blockNumber);
```

### 3. Contract Service - Interact with Smart Contracts

Smart contracts are like automated programs on the blockchain. This service helps you talk to them.

**What it does**: Reads data from contracts, sends transactions to contracts, and estimates gas costs.

```typescript
// Define what functions the contract has (ABI = Application Binary Interface)
const ERC20_ABI = [
  "function transfer(address to, uint256 amount) public returns (bool)",
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

// Get a contract instance (like opening an app)
const contract = await agent.contract.getContract(
  '0xFanTokenContractAddress',  // Contract address
  ERC20_ABI  // Contract interface
);

// Read data from the contract (free, no transaction needed)
const balance = await agent.contract.callMethod(
  contract,
  'balanceOf',  // Function name
  [agent.address]  // Function parameters
);
console.log('Contract balance:', balance.toString());

// Estimate how much gas a transaction will cost
const gasEstimate = await agent.contract.estimateGas(
  contract,
  'transfer',  // Function name
  ['0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', '1000000000000000000']  // Parameters
);

// Send a transaction to the contract
const tx = await agent.contract.sendTransaction(
  contract,
  'transfer',  // Function name
  ['0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', '1000000000000000000'],  // Parameters
  { gasLimit: gasEstimate }  // Transaction options
);
console.log('Contract transaction sent:', tx.hash);
```

### 4. Events Service - Monitor Blockchain Activity

Events are like notifications from the blockchain. This service helps you listen to them.

**What it does**: Listens for real-time events and gets historical event data.

```typescript
// Subscribe to real-time events (like getting notifications)
await agent.events.subscribeToEvents(
  contract,
  'Transfer',  // Event name
  (event) => {
    console.log('Transfer happened!', {
      from: event.args.from,      // Who sent
      to: event.args.to,          // Who received
      value: event.args.value.toString()  // How much
    });
  },
  { from: agent.address }  // Only events from your address
);

// Get historical events (like checking your transaction history)
const pastEvents = await agent.events.getPastEvents(
  contract,
  'Transfer',  // Event name
  { to: agent.address },  // Filter: only events sent TO you
  1000000,  // Start from block 1,000,000
  'latest'   // End at the latest block
);
console.log('Past transfer events:', pastEvents.length);

// Stop listening to events
await agent.events.unsubscribeFromEvents(contract, 'Transfer');
```

### 5. Data Fetcher Service - Get Blockchain Information

This service helps you get all sorts of information from the blockchain.

**What it does**: Gets block data, transaction receipts, contract code, and storage data.

```typescript
// Get the latest block information
const latestBlock = await agent.data.getLatestBlock();
console.log('Latest block info:', {
  number: latestBlock.number,      // Block number
  hash: latestBlock.hash,          // Block hash
  timestamp: latestBlock.timestamp // When it was created
});

// Get a specific block
const block = await agent.data.getBlockByNumber(1000000);
console.log('Block 1,000,000:', block);

// Get transaction receipt (confirmation details)
const receipt = await agent.data.getTransactionReceipt(txHash);
if (receipt) {
  console.log('Transaction status:', receipt.status === 1 ? 'Success' : 'Failed');
}

// Check if an address is a smart contract
const code = await agent.data.getCode('0xContractAddress');
const isContract = code !== '0x';  // If it has code, it's a contract
console.log('Is this a contract?', isContract);

// Get data from contract storage
const storage = await agent.data.getStorageAt(
  '0xContractAddress',  // Contract address
  '0x0',                // Storage slot
  'latest'              // Block to check
);
console.log('Storage value:', storage);
```

### 6. LangChain Integration - AI-Powered Blockchain Operations

This is where it gets really cool! You can use AI to automatically perform blockchain operations.

**What it does**: Creates AI tools that can send transactions, check balances, and more.

```typescript
import { getChilizTools } from 'chiliz-agent-kit/langchain';
import { ChatOpenAI } from '@langchain/openai';
import { AgentExecutor } from 'langchain/agents';

// Define which tokens your AI agent knows about
const tokenMap = {
  PSG: { address: '0xPSGTokenAddress', decimals: 18 },
  JUV: { address: '0xJUVTokenAddress', decimals: 18 },
  ACM: { address: '0xACMTokenAddress', decimals: 18 }
};

// Create AI tools for the agent
const tools = getChilizTools(agent, tokenMap);

// Set up the AI agent with OpenAI
const llm = new ChatOpenAI({
  modelName: 'gpt-4o',
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY
});

// Create the agent executor
const agentExecutor = new AgentExecutor({
  agent: new OpenAIFunctionsAgent({
    llm,
    tools,
    prompt: PromptTemplate.fromTemplate("You are a helpful blockchain assistant.")
  }),
  tools,
  verbose: true
});

// Now your AI can perform blockchain operations!
const result = await agentExecutor.invoke({
  input: "Send 5 PSG tokens to 0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
});
```

**Note**: You need an OpenAI API key in your `.env` file for AI integration:
```env
OPENAI_API_KEY=your-openai-api-key-here
```

### 7. Utility Classes - Helper Functions

#### ChilizConverters - Format Numbers and Data

This helps you convert between different number formats used in blockchain.

**What it does**: Converts between CHZ and wei (smallest unit), formats numbers, and handles hex data.

```typescript
import { ChilizConverters } from 'chiliz-agent-kit';

// Convert between CHZ and wei (like dollars and cents)
const wei = ChilizConverters.toWei('1.5');        // 1.5 CHZ → wei
const ether = ChilizConverters.fromWei(wei);      // wei → CHZ
console.log('1.5 CHZ in wei:', wei.toString());
console.log('Back to CHZ:', ether);

// Format numbers with custom decimals
const formatted = ChilizConverters.formatUnits('1000000000000000000', 18);
const parsed = ChilizConverters.parseUnits('1.5', 18);
console.log('Formatted number:', formatted);
console.log('Parsed number:', parsed.toString());

// Convert to and from hex format
const hex = ChilizConverters.toHex(wei);
const backToBN = ChilizConverters.fromHex(hex);
console.log('Hex representation:', hex);
```

#### Error Handling - Better Error Messages

The SDK provides specific error types so you know exactly what went wrong.

**What it does**: Gives you detailed error information for different types of failures.

```typescript
import { 
  TransactionError, 
  ContractError, 
  NetworkError,
  ValidationError 
} from 'chiliz-agent-kit';

try {
  await agent.transaction.sendCHZ('0xinvalid', '1.0');
} catch (error) {
  if (error instanceof TransactionError) {
    console.error('Transaction failed:', error.message);
    console.error('Transaction hash:', error.txHash);
  } else if (error instanceof ValidationError) {
    console.error('Invalid input:', error.message);
  } else if (error instanceof NetworkError) {
    console.error('Network problem:', error.message);
  } else if (error instanceof ContractError) {
    console.error('Contract error:', error.message);
    console.error('Contract address:', error.address);
    console.error('Method called:', error.method);
  }
}
```

---

## 🛠️ Installation and Integration Guide

### Step 1: Install Dependencies

#### Basic Installation
```bash
# Install the Chiliz Agent Kit and ethers.js
npm install chiliz-agent-kit ethers@5

# For TypeScript projects, types are included
npm install --save-dev @types/node
```

#### For AI Integration (LangChain)
```bash
# Install the Chiliz Agent Kit with LangChain dependencies
npm install chiliz-agent-kit ethers@5 @langchain/openai @langchain/core langchain

# For TypeScript projects, types are included
npm install --save-dev @types/node
```

### Step 2: Environment Setup

Create a `.env` file in your project root:

```env
# Chiliz Network Configuration
CHILIZ_RPC_URL=https://rpc.chiliz.com
CHILIZ_WS_URL=wss://ws.chiliz.com

# Your private key (keep secure!)
PRIVATE_KEY=your-private-key-here

# For AI Integration (Optional)
OPENAI_API_KEY=your-openai-api-key-here

# Optional: Logging configuration
LOG_LEVEL=info
LOG_FORMAT=json
```

**⚠️ Security Warning**: Never commit your `.env` file to version control! Add it to `.gitignore`.

### Step 3: Basic Integration

Create your main application file:

```typescript
import { ChilizAgent } from 'chiliz-agent-kit';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

async function main() {
  try {
    // Initialize the agent
    const agent = await ChilizAgent.create({
      rpcUrl: process.env.CHILIZ_RPC_URL!,
      privateKey: process.env.PRIVATE_KEY!
    });

    console.log('Agent initialized with address:', agent.address);

    // Your blockchain operations here
    const balance = await agent.transaction.getBalance();
    console.log('Current balance:', balance, 'CHZ');

  } catch (error) {
    console.error('Error:', error);
  }
}

main();
```

### Step 4: Advanced Integration

For more complex applications, consider this structure:

```typescript
import { ChilizAgent, ChilizConverters } from 'chiliz-agent-kit';

class ChilizApp {
  private agent: ChilizAgent;

  constructor() {
    this.initializeAgent();
  }

  private async initializeAgent() {
    this.agent = await ChilizAgent.create({
      rpcUrl: process.env.CHILIZ_RPC_URL!,
      privateKey: process.env.PRIVATE_KEY!
    });
  }

  async sendTokens(recipient: string, amount: string, tokenAddress?: string) {
    try {
      if (tokenAddress) {
        // Send ERC-20 token (fan token)
        return await this.agent.transaction.sendERC20(
          tokenAddress,
          recipient,
          amount
        );
      } else {
        // Send native CHZ
        return await this.agent.transaction.sendCHZ(recipient, amount);
      }
    } catch (error) {
      console.error('Token transfer failed:', error);
      throw error;
    }
  }

  async monitorTransfers(contractAddress: string) {
    const contract = await this.agent.contract.getContract(
      contractAddress,
      ['event Transfer(address indexed from, address indexed to, uint256 value)']
    );

    await this.agent.events.subscribeToEvents(
      contract,
      'Transfer',
      (event) => {
        console.log('Transfer detected:', {
          from: event.args.from,
          to: event.args.to,
          value: ChilizConverters.fromWei(event.args.value)
        });
      }
    );
  }
}

// Usage
const app = new ChilizApp();
await app.sendTokens('0xRecipientAddress', '1.5');
await app.monitorTransfers('0xTokenContractAddress');
```

### Step 5: Browser Integration

For browser-based applications (Next.js, React, etc.):

```typescript
// Add polyfill for setImmediate if needed
if (typeof window !== "undefined" && typeof window.setImmediate === "undefined") {
  window.setImmediate = (fn: (...args: any[]) => void, ...args: any[]) => 
    setTimeout(fn, 0, ...args);
}

// Initialize agent in browser
const agent = await ChilizAgent.create({
  rpcUrl: 'https://rpc.chiliz.com',
  privateKey: 'your-private-key' // Use wallet connection in production
});
```

**⚠️ Important Security Note**: Never use real private keys in browser code for production! Instead, use MetaMask, WalletConnect, or other wallet providers for user authentication.

### Step 6: Testing

Create test files to verify your integration:

```typescript
import { ChilizAgent } from 'chiliz-agent-kit';

describe('Chiliz Agent Integration', () => {
  let agent: ChilizAgent;

  beforeAll(async () => {
    agent = await ChilizAgent.create({
      rpcUrl: process.env.CHILIZ_RPC_URL!,
      privateKey: process.env.PRIVATE_KEY!
    });
  });

  test('should get balance', async () => {
    const balance = await agent.transaction.getBalance();
    expect(balance).toBeDefined();
    expect(parseFloat(balance)).toBeGreaterThanOrEqual(0);
  });

  test('should get latest block', async () => {
    const block = await agent.data.getLatestBlock();
    expect(block.number).toBeGreaterThan(0);
  });
});
```

### Step 7: Production Deployment

For production applications:

1. **Security**: Never expose private keys in client-side code
2. **Environment**: Use environment variables for all sensitive data
3. **Monitoring**: Implement proper logging and error tracking
4. **Rate Limiting**: Implement rate limiting for RPC calls
5. **Backup**: Always backup your private keys securely

```typescript
// Production-ready configuration
const agent = await ChilizAgent.create({
  rpcUrl: process.env.CHILIZ_RPC_URL!,
  privateKey: process.env.PRIVATE_KEY!
});

// Add error handling
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  // Implement your error reporting here
});
```

---

## 🔧 Troubleshooting & FAQ

### Common Errors and Solutions

#### 1. "setImmediate is not defined"
**Problem**: You're using the SDK in a browser environment.
**Solution**: Add this polyfill at the top of your file:
```typescript
if (typeof window !== "undefined" && typeof window.setImmediate === "undefined") {
  window.setImmediate = (fn: (...args: any[]) => void, ...args: any[]) => 
    setTimeout(fn, 0, ...args);
}
```

#### 2. "Missing CHILIZ_RPC_URL or PRIVATE_KEY"
**Problem**: Environment variables aren't loaded.
**Solution**: 
- Make sure you have a `.env` file
- Make sure you're calling `config()` from dotenv
- Check that the variable names match exactly

#### 3. "Missing OPENAI_API_KEY"
**Problem**: You're trying to use AI features without an OpenAI API key.
**Solution**: 
- Add `OPENAI_API_KEY=your-openai-api-key-here` to your `.env` file
- Get an API key from [OpenAI's platform](https://platform.openai.com/api-keys)

#### 4. "Transaction failed"
**Problem**: Transaction was rejected by the network.
**Solutions**:
- Check if you have enough CHZ for gas fees
- Verify the recipient address is correct
- Make sure you're not sending more than your balance
- Check if the network is congested

#### 5. "Insufficient token balance"
**Problem**: You're trying to send more tokens than you have.
**Solution**: Check your token balance first:
```typescript
const balance = await agent.transaction.getTokenBalance(tokenAddress);
console.log('Available balance:', balance);
```

#### 6. "Network error"
**Problem**: Can't connect to the Chiliz network.
**Solutions**:
- Check your internet connection
- Verify the RPC URL is correct
- Try using a different RPC endpoint
- Check if the Chiliz network is experiencing issues

### Performance Tips

1. **Reuse the agent**: Don't create a new agent for every operation
2. **Batch operations**: Group multiple operations together when possible
3. **Use appropriate gas limits**: Don't set gas limits too high
4. **Monitor network status**: Check gas prices before sending transactions

### Security Best Practices

1. **Never expose private keys**: Always use environment variables
2. **Use testnet for development**: Test with fake CHZ first
3. **Validate inputs**: Always check addresses and amounts
4. **Implement rate limiting**: Don't spam the network
5. **Monitor transactions**: Always wait for confirmations

---

## 📚 Additional Resources

- **Chiliz Official**: [chiliz.com](https://chiliz.com)
- **Chiliz Explorer**: [scan.chiliz.com](https://testnet.chiliscan.com)
- **GitHub Repository**: [github.com/Fan-Trovio/chiliz-agent-kit](https://github.com/Fan-Trovio/chiliz-agent-kit)
- **NPM Package**: [npmjs.com/package/chiliz-agent-kit](https://npmjs.com/package/chiliz-agent-kit)

---

This comprehensive documentation provides everything needed to integrate the Chiliz Agent Kit into your applications, from basic setup to advanced usage patterns and production deployment considerations. Whether you're a blockchain beginner or an experienced developer, this SDK makes it easy to build powerful applications on the Chiliz network. 