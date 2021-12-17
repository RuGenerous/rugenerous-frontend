import { useQuery } from "react-query";
import { ethers } from "ethers";
import { getMarketPrice } from "../helpers/get-market-price";
import { DEFAULD_NETWORK } from "../constants/blockchain";

export const useGetCurrentMarketPriceQuery = (provider: ethers.Signer | ethers.providers.Provider) => {
  return useQuery("current-market-price", () => getMarketPrice(DEFAULD_NETWORK, provider), { initialData: 0 });
};
