import { ethers } from 'ethers';
import { ChilizAgent } from '../src';
import { Logger } from '../src/utils/logger';

async function main() {
  try {
    const agent = await ChilizAgent.create();
    
    // Example: Deploy an ERC20 token
    const tokenName = 'MyToken';
    const tokenSymbol = 'MTK';
    const initialSupply = ethers.parseEther('1000000'); // 1 million tokens

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