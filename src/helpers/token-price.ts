import { StaticJsonRpcProvider } from "@ethersproject/providers";
import axios from "axios";
import { ethers } from "ethers";
import { abi as TimeContract } from "../abi/tokens/RugTokenContract..json";

const cache: { [key: string]: number } = {};

export const loadTokenPrices = async () => {
  const url =
    "https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2,wonderland,benqi,usd-coin,tether,olympus,magic-internet-money&vs_currencies=usd";
  const { data } = await axios.get(url);

  async function getCurrentIndex() {
    const Time = new ethers.Contract("0x0", TimeContract);
    const TimeCurrentIndex = await Time.currentIndex();
    return Number(TimeCurrentIndex);
  }

  cache["AVAX"] = data["avalanche-2"].usd;
  cache["MIM"] = data["magic-internet-money"].usd;
  cache["USDC"] = data["usd-coin"].usd * Math.pow(10, 12);
  cache["USDT"] = data["tether"].usd;
  cache["OHM"] = data["olympus"].usd;
  cache["QI"] = data["benqi"].usd;
  cache["MEMO"] = data["wonderland"].usd * (await getCurrentIndex());
};

export const getTokenPrice = (symbol: string): number => {
  return Number(cache[symbol]);
};
