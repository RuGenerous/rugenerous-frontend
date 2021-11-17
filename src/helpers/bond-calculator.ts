import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../constants/blockchain";
import { abi as BondCalcContract } from "../abi/BondCalcContract.json";
import { ethers } from "ethers";
import { getAddresses } from "../constants/addresses";

export function getBondCalculator(networkID: Networks, provider: StaticJsonRpcProvider) {
    const addresses = getAddresses(networkID);
    return new ethers.Contract(addresses.RUG_BONDING_CALC_ADDRESS, BondCalcContract, provider);
}
