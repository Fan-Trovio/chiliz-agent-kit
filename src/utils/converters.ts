import { ethers } from 'ethers';

export class ChilizConverters {
  static readonly DECIMALS = 18;

  static toWei(amount: string | number): ethers.BigNumber {
    return ethers.utils.parseUnits(amount.toString(), this.DECIMALS);
  }

  static fromWei(amount: ethers.BigNumberish): string {
    return ethers.utils.formatUnits(amount, this.DECIMALS);
  }

  static toHex(amount: ethers.BigNumberish): string {
    return ethers.utils.hexlify(amount);
  }

  static fromHex(hex: string): ethers.BigNumber {
    return ethers.BigNumber.from(hex);
  }

  static formatUnits(amount: ethers.BigNumberish, decimals: number = this.DECIMALS): string {
    return ethers.utils.formatUnits(amount, decimals);
  }

  static parseUnits(amount: string, decimals: number = this.DECIMALS): ethers.BigNumber {
    return ethers.utils.parseUnits(amount, decimals);
  }

  static formatEther(wei: ethers.BigNumberish): string {
    return ethers.utils.formatEther(wei);
  }

  static parseEther(ether: string): ethers.BigNumber {
    return ethers.utils.parseEther(ether);
  }
} 