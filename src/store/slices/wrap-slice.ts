import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { messages } from "../../constants/messages";
import { getAddresses, Networks } from "../../constants";
import { setAll, sleep } from "../../helpers";
import { info, success, warning } from "./messages-slice";
import { RootState } from "../store";
import { ethers } from "ethers";
import { metamaskErrorWrap } from "../../helpers/metamask-error-wrap";
import { wsRugTokenContract } from "../../abi";
import { clearPendingTxn, fetchPendingTxns, getwrappingTypeText } from "./pending-txns-slice";
import { getGasPrice } from "../../helpers/get-gas-price";
import { fetchAccountSuccess, getBalances } from "./account-slice";

export interface IChangeApproval {
  provider: StaticJsonRpcProvider | JsonRpcProvider;
  networkID: Networks;
  address: string;
}

export const changeApproval = createAsyncThunk(
  "wrapping/changeApproval",
  async ({ provider, address, networkID }: IChangeApproval, { dispatch }) => {
    if (!provider) {
      dispatch(warning({ text: messages.please_connect_wallet }));
      return;
    }

    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const srugContract = new ethers.Contract(addresses.SRUG_ADDRESS, wsRugTokenContract, signer);

    let approveTx;
    try {
      const gasPrice = await getGasPrice(provider);

      approveTx = await srugContract.approve(addresses.WSRUG_ADDRESS, ethers.constants.MaxUint256, { gasPrice });

      const text = "Approve wrapping";
      const pendingTxnType = "approve_wrapping";

      dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));
      await approveTx.wait();
      dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
      return metamaskErrorWrap(err, dispatch);
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

    await sleep(2);

    const wsrugAllowance = await srugContract.allowance(address, addresses.WSRUG_ADDRESS);

    return dispatch(
      fetchAccountSuccess({
        wrapping: {
          wsrug: Number(wsrugAllowance),
        },
      }),
    );
  },
);

export interface IChangeWrap {
  isWrap: boolean;
  value: string;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
  networkID: Networks;
  address: string;
}

export const changeWrap = createAsyncThunk(
  "wrapping/changeWrap",
  async ({ isWrap, value, provider, networkID, address }: IChangeWrap, { dispatch }) => {
    if (!provider) {
      dispatch(warning({ text: messages.please_connect_wallet }));
      return;
    }

    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const amountInWei = isWrap ? ethers.utils.parseUnits(value, "gwei") : ethers.utils.parseEther(value);
    const wsRugContract = new ethers.Contract(addresses.WSRUG_ADDRESS, wsRugTokenContract, signer);

    let wrapTx;

    try {
      const gasPrice = await getGasPrice(provider);

      if (isWrap) {
        wrapTx = await wsRugContract.wrap(amountInWei, { gasPrice });
      } else {
        wrapTx = await wsRugContract.unwrap(amountInWei, { gasPrice });
      }

      const pendingTxnType = isWrap ? "wrapping" : "unwrapping";
      dispatch(fetchPendingTxns({ txnHash: wrapTx.hash, text: getwrappingTypeText(isWrap), type: pendingTxnType }));
      await wrapTx.wait();
      dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
      return metamaskErrorWrap(err, dispatch);
    } finally {
      if (wrapTx) {
        dispatch(clearPendingTxn(wrapTx.hash));
      }
    }

    dispatch(info({ text: messages.your_balance_update_soon }));
    await sleep(10);
    await dispatch(getBalances({ address, networkID, provider }));
    dispatch(info({ text: messages.your_balance_updated }));
    return;
  },
);

export interface IWrapDetails {
  isWrap: boolean;
  value: string | null;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
  networkID: Networks;
}

export const calcWrapDetails = createAsyncThunk(
  "wrapping/calcWrapDetails",
  async ({ isWrap, value, provider, networkID }: IWrapDetails, { dispatch }) => {
    if (!provider) {
      dispatch(warning({ text: messages.please_connect_wallet }));
      return;
    }

    if (!value) {
      return new Promise<any>(resolve =>
        resolve({
          wrapValue: "",
        }),
      );
    }

    const addresses = getAddresses(networkID);

    const amountInWei = isWrap ? ethers.utils.parseUnits(value, "gwei") : ethers.utils.parseEther(value);

    let wrapValue = 0;

    const wsrugContract = new ethers.Contract(addresses.WSRUG_ADDRESS, wsRugTokenContract, provider);

    if (isWrap) {
      const wsrugValue = await wsrugContract.wsRUGTosRUG(amountInWei);
      wrapValue = wsrugValue / Math.pow(10, 18);
    } else {
      const srugValue = await wsrugContract.wsRUGTosRUG(amountInWei);
      wrapValue = srugValue / Math.pow(10, 9);
    }

    return {
      wrapValue,
    };
  },
);

export interface IWrapSlice {
  loading: boolean;
  wrapValue: "";
}

const initialState: IWrapSlice = {
  loading: true,
  wrapValue: "",
};

const wrapSlice = createSlice({
  name: "wrapping",
  initialState,
  reducers: {
    fetchWrapSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(calcWrapDetails.pending, state => {
        state.loading = true;
      })
      .addCase(calcWrapDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(calcWrapDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      });
  },
});

export default wrapSlice.reducer;

export const { fetchWrapSuccess } = wrapSlice.actions;

const baseInfo = (state: RootState) => state.wrapping;

export const getwrappingState = createSelector(baseInfo, wrapping => wrapping);
