import { ChilizAgent } from '../dist';
import { config } from 'dotenv';
config();

async function main() {
  const tPSG_ADDRESS = "0x4a48b0ba2d14cd779f48912542c14bb9bf9bf75c";
  const recipient = "0xA879eB55AaD088A8a19E06610129d4CDb4f2c99b";
  const amount = "100";

  const rpcUrl = process.env.CHILIZ_RPC_URL!;
  const privateKey = process.env.PRIVATE_KEY!;

  const agent = await ChilizAgent.create({ rpcUrl, privateKey });
  const txHash = await agent.transaction.sendERC20(tPSG_ADDRESS, recipient, amount);
  console.log("Sent 100 tPSG! Tx hash:", txHash);

  const receipt = await agent.transaction.waitForTransaction(txHash);
  console.log("Receipt:", receipt);

  await agent.close();
}

main().catch(console.error); 