import { useWeb3Context } from ".";
import { useGetCurrentMarketPriceQuery } from "../queries";
import { messages } from "../constants";

const { price_loading_message } = messages;

export const useGetMarketPrice = () => {
  const { provider } = useWeb3Context();
  const { isLoading, data: marketPrice = price_loading_message } = useGetCurrentMarketPriceQuery(provider);

  if (isLoading) {
    return price_loading_message;
  }

  return marketPrice;
};
