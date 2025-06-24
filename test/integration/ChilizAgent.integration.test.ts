import { ChilizAgent } from '../../src';
import { ChilizConverters } from '../../src/utils/converters';

describe('ChilizAgent Integration Tests', () => {
  let agent: ChilizAgent;

  beforeAll(async () => {
    agent = await ChilizAgent.create();
  });

  afterAll(async () => {
    await agent.close();
  });

  describe('Network Connection', () => {
    it('should connect to Chiliz testnet', async () => {
      const chainId = await agent.getChainId();
      expect(chainId).toBe(BigInt(88882)); // Testnet chain ID
    });

    it('should get current gas price', async () => {
      const gasPrice = await agent.getGasPrice();
      expect(gasPrice).toBeGreaterThan(BigInt(0));
    });
  });

  describe('Balance Queries', () => {
    it('should get account balance', async () => {
      const balance = await agent.transaction.getBalance();
      expect(typeof balance).toBe('string');
      expect(parseFloat(balance)).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Transaction Estimation', () => {
    it('should estimate gas for a transfer', async () => {
      const tx = {
        to: '0x1234567890123456789012345678901234567890',
        value: ChilizConverters.parseEther('0.1')
      };

      const gasEstimate = await agent.estimateGas(tx);
      expect(gasEstimate).toBeGreaterThan(BigInt(0));
    });
  });

  describe('Message Signing', () => {
    it('should sign and verify a message', async () => {
      const message = 'Test message';
      const signature = await agent.signMessage(message);
      const recoveredAddress = await agent.verifyMessage(message, signature);
      
      expect(typeof signature).toBe('string');
      expect(signature).toMatch(/^0x[0-9a-fA-F]{130}$/);
      expect(recoveredAddress).toMatch(/^0x[0-9a-fA-F]{40}$/);
    });
  });
}); 