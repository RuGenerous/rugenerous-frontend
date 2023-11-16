import { ethers } from "ethers";
import { LpReserveContract } from "../abi";
import { mimRug } from "../helpers/bond";
import { Networks } from "../constants/blockchain";
import { getAddresses } from "../constants/addresses";

export async function getMarketPrice(
  networkID: Networks,
  provider: ethers.Signer | ethers.providers.Provider,
): Promise<number> {
  const addresses = getAddresses(networkID);
  const pairContract = new ethers.Contract(addresses.RUG_USDC_LP_JOE, LpReserveContract, provider);
  const reserves = await pairContract.getReserves();
  const marketPrice = (1000 * reserves[1]) / reserves[0];
  return marketPrice;
}
