import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { StakingContract, SRugTokenContract, RugTokenContract, RedemptionContract } from "../../abi";
import { setAll } from "../../helpers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider } from "@ethersproject/providers";
import { getMarketPrice, getTokenPrice } from "../../helpers";
import { RootState } from "../store";
import allBonds from "../../helpers/bond";
import { getTreasuryBalance } from "src/helpers/get-treasury";

interface ILoadAppDetails {
  networkID: number;
  provider: JsonRpcProvider;
}

export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  //@ts-ignore
  async ({ networkID, provider }: ILoadAppDetails) => {
    const mimPrice = getTokenPrice("MIM");
    const addresses = getAddresses(networkID);

    const stakingContract = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, provider);
    const currentBlock = await provider.getBlockNumber();
    const currentBlockTime = (await provider.getBlock(currentBlock)).timestamp;
    const srugContract = new ethers.Contract(addresses.SRUG_ADDRESS, SRugTokenContract, provider);
    const rugContract = new ethers.Contract(addresses.RUG_ADDRESS, RugTokenContract, provider);
    const redeemContract = new ethers.Contract(addresses.REDEEMING_ADDRESS, RedemptionContract, provider);
    const marketPrice = ((await getMarketPrice(networkID, provider)) / Math.pow(10, 9)) * mimPrice;

    const burnedSupply = (await rugContract.balanceOf(addresses.BURN_ADDRESS)) / Math.pow(10, 9);
    const totalSupply = (await rugContract.totalSupply()) / Math.pow(10, 9) - burnedSupply;
    const circSupply = (await srugContract.circulatingSupply()) / Math.pow(10, 9);

    const stakingTVL = circSupply * marketPrice;
    const marketCap = totalSupply * marketPrice;

    const tokenBalPromises = allBonds.map(bond => bond.getTreasuryBalance(networkID, provider));
    const tokenBalances = await Promise.all(tokenBalPromises);
    const treasuryBalance = await getTreasuryBalance();

    const timeBondsAmountsPromises = allBonds.map(bond => bond.getRugAmount(networkID, provider));
    const timeBondsAmounts = await Promise.all(timeBondsAmountsPromises);
    const timeAmount = timeBondsAmounts.reduce((timeAmount0, timeAmount1) => timeAmount0 + timeAmount1, 0);
    const timeSupply = totalSupply - timeAmount;

    const rfv = treasuryBalance / timeSupply;
    const setRFV = await redeemContract.RFV();

    const epoch = await stakingContract.epoch();
    const stakingReward = epoch.distribute;
    const circ = await srugContract.circulatingSupply();
    const stakingRebase = stakingReward / circ;
    const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
    const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;

    const currentIndex = await stakingContract.index();
    const nextRebase = epoch.endTime;

    const treasuryRunway = treasuryBalance / circSupply;
    const runway = Math.log(treasuryRunway) / Math.log(1 + stakingRebase) / 3;

    return {
      currentIndex: Number(ethers.utils.formatUnits(currentIndex, "gwei")) / Math.pow(10, 2),
      totalSupply,
      marketCap,
      currentBlock,
      circSupply,
      fiveDayRate,
      treasuryBalance,
      stakingAPY,
      stakingTVL,
      stakingRebase,
      marketPrice,
      currentBlockTime,
      nextRebase,
      rfv,
      setRFV,
      runway,
    };
  },
);

const initialState = {
  loading: true,
};

export interface IAppSlice {
  loading: boolean;
  stakingTVL: number;
  marketPrice: number;
  marketCap: number;
  circSupply: number;
  currentIndex: string;
  currentBlock: number;
  currentBlockTime: number;
  fiveDayRate: number;
  treasuryBalance: number;
  stakingAPY: number;
  stakingRebase: number;
  networkID: number;
  nextRebase: number;
  totalSupply: number;
  rfv: number;
  setRFV: number;
  runway: number;
}

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAppDetails.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
