import { ethers } from "ethers";
import { LpReserveContract } from "../abi";
import { mimRug } from "./bond";
import { Networks } from "../constants/blockchain";

export async function getMarketPrice(
  networkID: Networks,
  provider: ethers.Signer | ethers.providers.Provider,
): Promise<number> {
  const mimRugAddress = mimRug.getAddressForReserve(networkID);
  const pairContract = new ethers.Contract(mimRugAddress, LpReserveContract, provider);
  const reserves = await pairContract.getReserves();
  const marketPrice = reserves[0] / reserves[1];
  return marketPrice;
}
