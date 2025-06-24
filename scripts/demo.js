const { ChilizAgent } = require('../dist/src');

async function main() {
  const agent = await ChilizAgent.create();

  // 1. Get chain ID
  const chainId = await agent.getChainId();
  console.log('Chain ID:', chainId.toString());

  // 2. Get current gas price
  const gasPrice = await agent.getGasPrice();
  console.log('Current gas price:', gasPrice.toString());

  // 3. Get account balance
  const balance = await agent.transaction.getBalance();
  console.log('Account balance:', balance);

  // 4. Estimate gas for a transfer
  const tx = {
    to: '0x1234567890123456789012345678901234567890',
    value: BigInt(1e16) // 0.01 CHZ in wei
  };
  const gasEstimate = await agent.estimateGas(tx);
  console.log('Gas estimate for transfer:', gasEstimate.toString());

  // 5. Sign and verify a message
  const message = 'Hello from ChilizAgent!';
  const signature = await agent.signMessage(message);
  const recovered = await agent.verifyMessage(message, signature);
  console.log('Signature:', signature);
  console.log('Recovered address:', recovered);

  // 6. Send 1 CHZ to the specified address
  const txHash = await agent.transaction.sendCHZ('0xA879eB55AaD088A8a19E06610129d4CDb4f2c99b', '1');
  console.log('Transaction hash:', txHash);

  await agent.close();
}

main().catch(console.error); 