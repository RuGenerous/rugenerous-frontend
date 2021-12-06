import { JsonRpcProvider, Provider, StaticJsonRpcProvider } from "@ethersproject/providers";
import axios from "axios";
import { ethers } from "ethers";
import { abi as MemoContract } from "../abi/tokens/SRugContract.json";
import { getMainnetURI } from "src/hooks/web3/helpers";

const cache: { [key: string]: number } = {};

export const loadTokenPrices = async () => {
  const url =
    "https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2,wonderland,benqi,usd-coin,tether,olympus,magic-internet-money&vs_currencies=usd";
  const { data } = await axios.get(url);

  async function getCurrentIndex() {
    const Time = new ethers.Contract(
      "0x136Acd46C134E8269052c62A67042D6bDeDde3C9",
      MemoContract,
      new JsonRpcProvider(getMainnetURI()),
    );
    const TimeCurrentIndex = await Time.INDEX();
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
