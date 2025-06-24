import { ethers } from 'ethers';

export class ChilizConverters {
  static readonly DECIMALS = 18;

  static toWei(amount: string | number): bigint {
    return ethers.parseUnits(amount.toString(), this.DECIMALS);
  }

  static fromWei(amount: bigint | string): string {
    return ethers.formatUnits(amount, this.DECIMALS);
  }

  static toHex(amount: bigint | number | string): string {
    return ethers.toBeHex(amount);
  }

  static fromHex(hex: string): bigint {
    return ethers.toBigInt(hex);
  }

  static formatUnits(amount: bigint | string, decimals: number = this.DECIMALS): string {
    return ethers.formatUnits(amount, decimals);
  }

  static parseUnits(amount: string, decimals: number = this.DECIMALS): bigint {
    return ethers.parseUnits(amount, decimals);
  }

  static formatEther(wei: bigint | string): string {
    return ethers.formatEther(wei);
  }

  static parseEther(ether: string): bigint {
    return ethers.parseEther(ether);
  }
} 