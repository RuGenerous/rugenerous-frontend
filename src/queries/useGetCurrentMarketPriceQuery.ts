import { useQuery } from "react-query";
import { ethers } from "ethers";
import { getMarketPrice } from "../helpers/get-market-price";
import { trim, getTokenPrice } from "../helpers";
import { DEFAULD_NETWORK, PRICE_REFETCH_INTERVAL_MS, messages } from "../constants";

const { price_loading_message } = messages;

export const useGetCurrentMarketPriceQuery = (provider: ethers.Signer | ethers.providers.Provider) =>
  useQuery(
    "current-market-price",
    async () => {
      try {
        const res = await getMarketPrice(DEFAULD_NETWORK, provider);
        return `$${trim((res / Math.pow(10, 9)) * getTokenPrice("MIM"), 2)}`;
      } catch (error) {
        console.log("Error Loading Price, Retrying in 10 Seconds: ", error);
        return price_loading_message;
      }
    },
    {
      refetchInterval: PRICE_REFETCH_INTERVAL_MS,
    },
  );
