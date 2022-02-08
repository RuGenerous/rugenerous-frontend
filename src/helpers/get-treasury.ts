import { usdt, usdc, IToken } from "./tokens";
import { getTokenPrice } from ".";
import { getAddresses } from "src/constants";
import { ethers } from "ethers";
import { DEFAULD_NETWORK, Networks } from "../constants/blockchain";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { getMainnetURI } from "src/hooks/web3/helpers";
import { ERC20Contract } from "../abi";

const treasury_assets = [usdt, usdc];

async function getBalance(networkID: Networks, provider: StaticJsonRpcProvider, token: IToken) {
  const addresses = getAddresses(networkID);
  const tokenContract = new ethers.Contract(token.address, ERC20Contract, provider);
  let tokenAmount = 0;
  if (tokenContract.balanceOf) {
    tokenAmount = await tokenContract.balanceOf(addresses.TREASURY_ADDRESS);
  }
  const tokenDecimals = await tokenContract.decimals();
  return tokenAmount / Math.pow(10, tokenDecimals);
}

const obtainTokenPrice = async (token: IToken) => {
  return getTokenPrice(token.cgName ? token.cgName : token.name);
};

export async function getTreasuryBalance() {
  let result = 0;
  for (let i = 0; i < treasury_assets.length; i++) {
    result +=
      (await getBalance(DEFAULD_NETWORK, new JsonRpcProvider(getMainnetURI()), treasury_assets[i])) *
      (await obtainTokenPrice(treasury_assets[i]));
  }
  return result;
}
