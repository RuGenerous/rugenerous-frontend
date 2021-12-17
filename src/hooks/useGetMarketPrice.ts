import { useWeb3Context } from ".";
import { useGetCurrentMarketPriceQuery } from "../queries";
import { trim, getTokenPrice } from "../helpers";

export const useGetMarketPrice = () => {
  const { provider } = useWeb3Context();
  const { isFetched, isLoading, data: marketPrice = 0 } = useGetCurrentMarketPriceQuery(provider);

  if (isFetched && marketPrice > 0) {
    return `$${trim((marketPrice / Math.pow(10, 9)) * getTokenPrice("MIM"), 2)}`;
  }

  return "Loading..";
};
