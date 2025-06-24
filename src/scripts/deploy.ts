import { ethers } from 'ethers';
import { ChilizAgent } from '..';
import { Logger } from '../utils/logger';
import { config } from 'dotenv';

config();

async function main() {
  try {
    const rpcUrl = process.env.CHILIZ_RPC_URL;
    const privateKey = process.env.PRIVATE_KEY;

    if (!rpcUrl || !privateKey) {
      throw new Error("Missing CHILIZ_RPC_URL or PRIVATE_KEY in .env file for deployment");
    }

    const agent = await ChilizAgent.create({ rpcUrl, privateKey });
    
    // Example: Deploy an ERC20 token
    const tokenName = 'MyToken';
    const tokenSymbol = 'MTK';
    const initialSupply = ethers.utils.parseEther('1000000'); // 1 million tokens

    const contractFactory = new ethers.ContractFactory(
      // ABI and bytecode would go here
      [],
      '0x',
      await agent.contract.getSigner()
    );

    Logger.info('Deploying token contract...', {
      name: tokenName,
      symbol: tokenSymbol,
      initialSupply: initialSupply.toString()
    });

    const contract = await contractFactory.deploy(
      tokenName,
      tokenSymbol,
      initialSupply
    );

    await contract.waitForDeployment();
    const address = await contract.getAddress();

    Logger.info('Token deployed successfully', {
      address,
      transactionHash: contract.deploymentTransaction()?.hash
    });

    return address;
  } catch (error) {
    Logger.error('Deployment failed', { error });
    throw error;
  }
}

// Run deployment
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} 