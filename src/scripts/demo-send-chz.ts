import { ChilizAgent } from '..';
import { config } from 'dotenv';

config();

async function main() {
  const recipient = '0xA879eB55AaD088A8a19E06610129d4CDb4f2c99b';
  const amountToSend = '1'; // 1 CHZ

  const rpcUrl = process.env.CHILIZ_RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;

  if (!rpcUrl || !privateKey) {
    throw new Error('Missing CHILIZ_RPC_URL or PRIVATE_KEY in .env file');
  }

  const agent = await ChilizAgent.create({ rpcUrl, privateKey });
  console.log(`Sending ${amountToSend} CHZ to ${recipient}...`);
  try {
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
  } catch (error) {
    console.error('Error sending CHZ:', error);
  } finally {
    await agent.close();
  }
}

main(); 