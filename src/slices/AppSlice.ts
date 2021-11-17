import { abi as StakingContract } from "../abi/RuGenerousStakingv2.json";
import { abi as sRugTokenContract } from "../abi/tokens/MemoContract.json";
import { abi as RugTokenContract } from "../abi/tokens/TimeContract..json";
import { setAll, getMarketPrice } from "../helpers";
import apollo from "../lib/apolloClient.js";
import { IBaseAsyncThunk } from "./interfaces";
import { RuGenerousStakingv2, SRugv2 } from "../../src/typechain";
import { ethers } from "ethers";
import {addresses as getAddresses} from "../constants";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { JsonRpcProvider } from "@ethersproject/providers";
import { getTokenPrice } from "../helpers/token-price";
import { RootState } from "../store";
import allBonds from "../helpers/bond";

interface ILoadAppDetails {
    networkID: number;
    provider: JsonRpcProvider;
}

export const loadAppDetails = createAsyncThunk(
    "app/loadAppDetails",
    //@ts-ignore
    async ({ networkID, provider }: ILoadAppDetails) => {
        const mimPrice = getTokenPrice("MIM");

        const ohmPrice = getTokenPrice("OHM");
        const ohmAmount = 1512.12854088 * ohmPrice;

        const stakingContract = new ethers.Contract(getAddresses[networkID].STAKING_ADDRESS, StakingContract, provider);
        const currentBlock = await provider.getBlockNumber();
        const currentBlockTime = (await provider.getBlock(currentBlock)).timestamp;
        const memoContract = new ethers.Contract(getAddresses[networkID].SRUG_ADDRESS, sRugTokenContract, provider);
        const timeContract = new ethers.Contract(getAddresses[networkID].RUG_ADDRESS, RugTokenContract, provider);

        const marketPrice = ((await getMarketPrice(networkID, provider)) / Math.pow(10, 9)) * mimPrice;

        const totalSupply = (await timeContract.totalSupply()) / Math.pow(10, 9);
        const circSupply = (await memoContract.circulatingSupply()) / Math.pow(10, 9);

        const stakingTVL = circSupply * marketPrice;
        const marketCap = totalSupply * marketPrice;

        const tokenBalPromises = allBonds.map(bond => bond.getTreasuryBalance(networkID, provider));
        const tokenBalances = await Promise.all(tokenBalPromises);
        const treasuryBalance = tokenBalances.reduce((tokenBalance0, tokenBalance1) => tokenBalance0 + tokenBalance1, ohmAmount);

        const tokenAmountsPromises = allBonds.map(bond => bond.getTokenAmount(networkID, provider));
        const tokenAmounts = await Promise.all(tokenAmountsPromises);
        const rfvTreasury = tokenAmounts.reduce((tokenAmount0, tokenAmount1) => tokenAmount0 + tokenAmount1, ohmAmount);

        const timeBondsAmountsPromises = allBonds.map(bond => bond.getTimeAmount(networkID, provider));
        const timeBondsAmounts = await Promise.all(timeBondsAmountsPromises);
        const timeAmount = timeBondsAmounts.reduce((timeAmount0, timeAmount1) => timeAmount0 + timeAmount1, 0);
        const timeSupply = totalSupply - timeAmount;

        const rfv = rfvTreasury / timeSupply;

        const epoch = await stakingContract.epoch();
        const stakingReward = epoch.distribute;
        const circ = await memoContract.circulatingSupply();
        const stakingRebase = stakingReward / circ;
        const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
        const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;

        const currentIndex = await stakingContract.index();
        const nextRebase = epoch.endTime;

        const treasuryRunway = rfvTreasury / circSupply;
        const runway = Math.log(treasuryRunway) / Math.log(1 + stakingRebase) / 3;

        return {
            currentIndex: Number(ethers.utils.formatUnits(currentIndex, "gwei")) / 4.5,
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

export const findOrLoadMarketPrice = createAsyncThunk(
    "app/findOrLoadMarketPrice",
    async ({ networkID, provider }: IBaseAsyncThunk, { dispatch, getState }) => {
      const state: any = getState();
      let marketPrice;
      // check if we already have loaded market price
      if (state.app.loadingMarketPrice === false && state.app.marketPrice) {
        // go get marketPrice from app.state
        marketPrice = state.app.marketPrice;
      } else {
        // we don't have marketPrice in app.state, so go get it
        try {
          const originalPromiseResult = await dispatch(
            loadMarketPrice({ networkID: networkID, provider: provider }),
          ).unwrap();
          marketPrice = originalPromiseResult?.marketPrice;
        } catch (rejectedValueOrSerializedError) {
          // handle error here
          console.error("Returned a null response from dispatch(loadMarketPrice)");
          return;
        }
      }
      return { marketPrice };
    },
  );
  
const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);