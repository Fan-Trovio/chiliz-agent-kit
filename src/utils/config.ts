import { config } from 'dotenv';
import { Logger } from './logger';

// Load environment variables
config();

type ConfigKey = 
  | 'CHILIZ_RPC_URL'
  | 'CHILIZ_WS_URL'
  | 'CHILIZ_TESTNET_RPC_URL'
  | 'PRIVATE_KEY'
  | 'LOG_LEVEL'
  | 'LOG_FORMAT';

const requiredKeys: ConfigKey[] = [
  'CHILIZ_RPC_URL',
  'PRIVATE_KEY'
];

export function getConfig(key: ConfigKey): string {
  const value = process.env[key];

  if (!value && requiredKeys.includes(key)) {
    const error = new Error(`Missing required environment variable: ${key}`);
    Logger.error('Configuration Error', { error });
    throw error;
  }

  return value || '';
}

// Validate required configuration on startup
export function validateConfig(): void {
  const missingKeys = requiredKeys.filter(key => !process.env[key]);
  
  if (missingKeys.length > 0) {
    const error = new Error(`Missing required environment variables: ${missingKeys.join(', ')}`);
    Logger.error('Configuration Validation Failed', { error });
    throw error;
  }

  // Validate private key format
  const privateKey = getConfig('PRIVATE_KEY');
  if (privateKey && !privateKey.match(/^0x[0-9a-fA-F]{64}$/)) {
    const error = new Error('Invalid private key format. Must be a 32-byte hex string with 0x prefix');
    Logger.error('Configuration Validation Failed', { error });
    throw error;
  }
} 