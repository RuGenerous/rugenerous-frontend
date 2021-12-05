import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../constants/blockchain";
import { BondingCalcContract } from "../abi";
import { ethers } from "ethers";
import { getAddresses } from "../constants/addresses";

export function getBondCalculator(networkID: Networks, provider: StaticJsonRpcProvider, name: string) {
  if (name !== "usdc_rug_rlp") {
    const addresses = getAddresses(networkID);
    return new ethers.Contract(addresses.RUG_BONDING_CALC_ADDRESS, BondingCalcContract, provider);
  } else {
    const addresses = getAddresses(networkID);
    return new ethers.Contract(addresses.FLEXIBLE_BONDING_CALC_ADDRESS, BondingCalcContract, provider);
  }
}
