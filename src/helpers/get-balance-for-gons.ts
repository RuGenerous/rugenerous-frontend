import { ethers } from "ethers";
import { SRugTokenContract } from "../abi";
import { Networks } from "../constants/blockchain";
import { getAddresses } from "src/constants/addresses";

export async function getBalanceForGons(
  gons: number,
  networkID: Networks,
  provider: ethers.Signer | ethers.providers.Provider,
): Promise<number> {
  const addresses = getAddresses(networkID);
  const srugContract = new ethers.Contract(addresses.SRUG_ADDRESS, SRugTokenContract, provider);
  const balanceWithRebases = await srugContract.balanceForGons(gons);
  return balanceWithRebases;
}
