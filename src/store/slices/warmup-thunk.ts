import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { StakingContract } from "../../abi";
import { clearPendingTxn, fetchPendingTxns, getWarmupTypeText } from "./pending-txns-slice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { loadWarmUpInfo, getBalances } from "./account-slice";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants/blockchain";
import { warning, success, info, error } from "./messages-slice";
import { messages } from "../../constants/messages";
import { getGasPrice } from "../../helpers/get-gas-price";
import { sleep } from "../../helpers";
import { metamaskErrorWrap } from "../../helpers/metamask-error-wrap";

interface IForfeit {
  action: string;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
  address: string;
  networkID: Networks;
}

export const forfeitOrClaim = createAsyncThunk(
  "warmup/forfeitOrClaim",
  async ({ action, provider, address, networkID }: IForfeit, { dispatch }) => {
    if (!provider) {
      dispatch(warning({ text: messages.please_connect_wallet }));
      return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const staking = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, signer);

    let forfeitTx;

    try {
      const gasPrice = await getGasPrice(provider);

      if (action === "forfeit") {
        forfeitTx = await staking.forfeit({ gasPrice });
      } else {
        forfeitTx = await staking.claim(address, { gasPrice });
      }
      await forfeitTx.wait();

      const pendingTxnType = action === "forfeit" ? "forfeit" : "claim";
      dispatch(fetchPendingTxns({ txnHash: forfeitTx.hash, text: getWarmupTypeText(action), type: pendingTxnType }));
      await forfeitTx.wait();
      dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
      return metamaskErrorWrap(err, dispatch);
    } finally {
      if (forfeitTx) {
        dispatch(clearPendingTxn(forfeitTx.hash));
      }
    }
    dispatch(info({ text: messages.your_balance_update_soon }));
    await sleep(10);
    await dispatch(getBalances({ address, networkID, provider }));
    await dispatch(loadWarmUpInfo({ address, networkID, provider }));
    dispatch(info({ text: messages.your_balance_updated }));
    await sleep(10);
    return;
  },
);
