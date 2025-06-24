const { ChilizAgent } = require('../dist/src');
const { ethers } = require('ethers');

// This is the address for the $PSG Fan Token on the Spicy Testnet.
const PSG_TOKEN_ADDRESS = '0xb0Fa395a3386800658B9617F90e834E2CeC76Dd3';

// A standard ERC20 ABI (Application Binary Interface) is needed to interact with the contract.
const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address recipient, uint256 amount) returns (bool)"
];

async function main() {
  console.log('--- Initializing Agent for Smart Contract Interaction ---');
  const agent = await ChilizAgent.create();
  const signer = await agent.contract.getSigner();
  console.log(`Agent initialized. Wallet Address: ${signer.address}\n`);

  // 1. Get a contract instance
  console.log('--- 1. Getting Contract Instance ---');
  const psgTokenContract = await agent.contract.getContract(PSG_TOKEN_ADDRESS, ERC20_ABI);
  console.log('Successfully created a contract instance for the $PSG token.\n');

  // 2. Read data from the contract (View Functions)
  console.log('--- 2. Reading Data from the Contract ---');
  try {
    const name = await psgTokenContract.name();
    const symbol = await psgTokenContract.symbol();
    const yourBalance = await psgTokenContract.balanceOf(signer.address);

    console.log(`Token Name: ${name}`);
    console.log(`Token Symbol: ${symbol}`);
    console.log(`Your $PSG Balance: ${ethers.formatEther(yourBalance)}\n`);
  } catch (error) {
    console.error('Could not read from contract. The testnet RPC might be unreliable for this contract.', error.message);
  }

  // 3. Write data to the contract (Sending a Transaction)
  console.log('--- 3. Writing Data to the Contract (Sending a Transfer Transaction) ---');
  const recipient = '0xA879eB55AaD088A8a19E06610129d4CDb4f2c99b';
  const amountToSend = ethers.parseUnits("0.1", 18); // Send 0.1 tokens

  console.log(`Attempting to transfer 0.1 $PSG to ${recipient}...`);

  try {
    const tx = await psgTokenContract.transfer(recipient, amountToSend);
    console.log(`Transaction sent! Hash: ${tx.hash}`);
    console.log('Waiting for confirmation...');
    const receipt = await tx.wait();

    if (receipt && receipt.status === 1) {
      console.log('Token transfer confirmed successfully!');
      console.log(`Block Number: ${receipt.blockNumber}\n`);

      const newBalance = await psgTokenContract.balanceOf(signer.address);
      console.log(`Your new $PSG Balance: ${ethers.formatEther(newBalance)}`);

    } else {
      console.error('Token transfer failed!');
    }
  } catch (error) {
      console.error('Could not send transaction to contract.', error.message);
  }

  await agent.close();
}

main().catch((error) => {
  console.error('An unexpected error occurred:', error);
  process.exit(1);
}); 