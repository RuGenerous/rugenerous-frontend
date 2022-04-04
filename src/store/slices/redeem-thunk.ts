import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { RugTokenContract, RedemptionContract } from "../../abi";
import { clearPendingTxn, fetchPendingTxns, getRedeemTypeText } from "./pending-txns-slice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances, loadWarmUpInfo } from "./account-slice";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants/blockchain";
import { warning, success, info, error } from "./messages-slice";
import { messages } from "../../constants/messages";
import { getGasPrice } from "../../helpers/get-gas-price";
import { metamaskErrorWrap } from "../../helpers/metamask-error-wrap";
import { sleep } from "../../helpers";

interface IChangeApproval {
  token: string;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
  address: string;
  networkID: Networks;
}

export const changeApproval = createAsyncThunk(
  "redeem/changeApproval",
  async ({ token, provider, address, networkID }: IChangeApproval, { dispatch }) => {
    if (!provider) {
      dispatch(warning({ text: messages.please_connect_wallet }));
      return;
    }
    const addresses = getAddresses(networkID);

    const signer = provider.getSigner();
    const timeContract = new ethers.Contract(addresses.RUG_ADDRESS, RugTokenContract, signer);

    let approveTx;
    try {
      const gasPrice = await getGasPrice(provider);

      if (token === "rug") {
        approveTx = await timeContract.approve(addresses.REDEEMING_ADDRESS, ethers.constants.MaxUint256, {
          gasPrice,
        });
      }

      const text = "Approve " + (token === "rug" ? "Redeem" : "Redeem");
      const pendingTxnType = token === "rug" ? "approve_redeem" : "approve_redeem";

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

    const redeemAllowance = await timeContract.allowance(address, addresses.REDEEMING_ADDRESS);

    return dispatch(
      fetchAccountSuccess({
        redeem: {
          timeRedeem: Number(redeemAllowance),
        },
      }),
    );
  },
);

interface IChangeRedeem {
  action: string;
  value: string;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
  address: string;
  networkID: Networks;
}

export const redeemFromRUG = createAsyncThunk(
  "redeem/redeemFromRUG",
  async ({ action, value, provider, address, networkID }: IChangeRedeem, { dispatch }) => {
    if (!provider) {
      dispatch(warning({ text: messages.please_connect_wallet }));
      return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const redeem = new ethers.Contract(addresses.REDEEMING_ADDRESS, RedemptionContract, signer);

    let redeemTx;

    try {
      const gasPrice = await getGasPrice(provider);
      redeemTx = await redeem.swap(ethers.utils.parseUnits(value, "gwei"), { gasPrice });
      console.log("hit");
      const pendingTxnType = action === "redeem" ? "redeem" : "redeeming";
      dispatch(fetchPendingTxns({ txnHash: redeemTx.hash, text: getRedeemTypeText(action), type: pendingTxnType }));
      await redeemTx.wait();
      dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
      if (err.data.message.length > 1) {
        return metamaskErrorWrap(err, dispatch);
      }
    } finally {
      if (redeemTx) {
        dispatch(clearPendingTxn(redeemTx.hash));
      }
    }
    dispatch(info({ text: messages.your_balance_update_soon }));
    await sleep(10);
    await dispatch(getBalances({ address, networkID, provider }));
    await dispatch(loadWarmUpInfo({ address, networkID, provider }));
    dispatch(info({ text: messages.your_balance_updated }));
    return;
  },
);
