import { ethers } from "ethers";
import { abi as LpReserveContract } from "../abi/reserves/RugDai.json";
import { mim } from "../helpers/bond";
import { Networks } from "../constants/blockchain";
import { AVALANCHE } from "src/constants";

export async function getMarketPrice(
  networkID: Networks,
  provider: ethers.Signer | ethers.providers.Provider,
): Promise<number> {
  const mimTimeAddress = mim.getAddressForReserve(AVALANCHE);
  const pairContract = new ethers.Contract(mimTimeAddress, LpReserveContract, provider);
  const reserves = await pairContract.getReserves();
  const marketPrice = reserves[0] / reserves[1];
  return marketPrice;
}
