import axios from "axios";

const cache: { [key: string]: number } = {};

export const loadTokenPrices = async () => {
  const url =
    "https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2,benqi,usd-coin,tether,olympus,magic-internet-money&vs_currencies=usd";
  const { data } = await axios.get(url);

  cache["AVAX"] = data["avalanche-2"].usd;
  cache["MIM"] = data["magic-internet-money"].usd;
  cache["USDC"] = data["usd-coin"].usd;
  cache["USDT"] = data["tether"].usd;
  cache["OHM"] = data["olympus"].usd;
  cache["QI"] = data["benqi"].usd;
};

export const getTokenPrice = (symbol: string): number => {
  return Number(cache[symbol]);
};
