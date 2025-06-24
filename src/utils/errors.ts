export class ChilizError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ChilizError';
  }
}

export class NetworkError extends ChilizError {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TransactionError extends ChilizError {
  public readonly txHash?: string;
  public readonly code?: string;

  constructor(message: string, txHash?: string, code?: string) {
    super(message);
    this.name = 'TransactionError';
    this.txHash = txHash;
    this.code = code;
  }
}

export class ContractError extends ChilizError {
  public readonly address: string;
  public readonly method: string;

  constructor(message: string, address: string, method: string) {
    super(message);
    this.name = 'ContractError';
    this.address = address;
    this.method = method;
  }
}

export class ValidationError extends ChilizError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ConfigurationError extends ChilizError {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

export class SignerError extends ChilizError {
  constructor(message: string) {
    super(message);
    this.name = 'SignerError';
  }
} 