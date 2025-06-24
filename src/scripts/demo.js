const { ChilizAgent } = require('../../dist');
const { ethers } = require('ethers');

async function main() {
  console.log('--- 1. Initializing Chiliz Agent ---');
  const agent = await ChilizAgent.create();
  console.log('Agent Initialized.\n');

  // --- Core Agent Functions ---
  console.log('--- 2. Core Agent Functions ---');
  const chainId = await agent.getChainId();
  console.log(`Chain ID: ${chainId}`);

  const gasPrice = await agent.getGasPrice();
  console.log(`Current Gas Price: ${gasPrice}`);

  const balance = await agent.transaction.getBalance();
  console.log(`Your Wallet Balance: ${balance} CHZ\n`);

  // --- Data Fetcher Service ---
  console.log('--- 3. Data Fetcher Service ---');
  const latestBlock = await agent.data.getLatestBlock();
  console.log(`Latest Block Number: ${latestBlock.number}\n`);

  // --- Full Transaction Lifecycle ---
  console.log('--- 4. Full Transaction Lifecycle ---');
  const recipient = '0xA879eB55AaD088A8a19E06610129d4CDb4f2c99b';
  const amountToSend = '0.001';
  
  console.log(`Sending ${amountToSend} CHZ to ${recipient}...`);
  const txHash = await agent.transaction.sendCHZ(recipient, amountToSend);
  console.log(`Transaction sent! Hash: ${txHash}`);

  console.log('Waiting for transaction confirmation...');
  const receipt = await agent.transaction.waitForTransaction(txHash);
  
  if (receipt && receipt.status === 1) {
    console.log('Transaction confirmed successfully!');
    console.log(`Block Number: ${receipt.blockNumber}`);
    console.log(`Gas Used: ${receipt.gasUsed.toString()}`);
  } else {
    console.error('Transaction failed!');
  }
  console.log('\n');

  // --- Closing Agent ---
  console.log('--- 5. Closing Agent ---');
  await agent.close();
  console.log('Agent closed.');
}

main().catch((error) => {
  console.error('An error occurred in the demo:', error);
  process.exit(1);
}); 