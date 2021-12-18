import { ethers } from "ethers";
import { getAddresses } from "../../constants";
import { StakingHelperContract, RugTokenContract, SRugTokenContract, StakingContract } from "../../abi";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./pending-txns-slice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances, loadWarmUpInfo } from "./account-slice";
import { JsonRpcProvider, StaticJsonRpcProvider } from "@ethersproject/providers";
import { Networks } from "../../constants/blockchain";
import { warning, success, info, error } from "../../store/slices/messages-slice";
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
  "stake/changeApproval",
  async ({ token, provider, address, networkID }: IChangeApproval, { dispatch }) => {
    if (!provider) {
      dispatch(warning({ text: messages.please_connect_wallet }));
      return;
    }
    const addresses = getAddresses(networkID);

    const signer = provider.getSigner();
    const timeContract = new ethers.Contract(addresses.RUG_ADDRESS, RugTokenContract, signer);
    const memoContract = new ethers.Contract(addresses.SRUG_ADDRESS, SRugTokenContract, signer);

    let approveTx;
    try {
      const gasPrice = await getGasPrice(provider);

      if (token === "rug") {
        approveTx = await timeContract.approve(addresses.STAKING_HELPER_ADDRESS, ethers.constants.MaxUint256, {
          gasPrice,
        });
      }

      if (token === "srug") {
        approveTx = await memoContract.approve(addresses.STAKING_ADDRESS, ethers.constants.MaxUint256, { gasPrice });
      }

      const text = "Approve " + (token === "rug" ? "Staking" : "Unstaking");
      const pendingTxnType = token === "rug" ? "approve_staking" : "approve_unstaking";

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

    const stakeAllowance = await timeContract.allowance(address, addresses.STAKING_HELPER_ADDRESS);
    const unstakeAllowance = await memoContract.allowance(address, addresses.STAKING_ADDRESS);

    return dispatch(
      fetchAccountSuccess({
        staking: {
          timeStake: Number(stakeAllowance),
          memoUnstake: Number(unstakeAllowance),
        },
      }),
    );
  },
);

interface IChangeStake {
  action: string;
  value: string;
  provider: StaticJsonRpcProvider | JsonRpcProvider;
  address: string;
  networkID: Networks;
  warmUpBalance: number;
}

export const changeStake = createAsyncThunk(
  "stake/changeStake",
  async ({ action, value, provider, address, networkID, warmUpBalance }: IChangeStake, { dispatch }) => {
    if (!provider) {
      dispatch(warning({ text: messages.please_connect_wallet }));
      return;
    }
    const addresses = getAddresses(networkID);
    const signer = provider.getSigner();
    const staking = new ethers.Contract(addresses.STAKING_ADDRESS, StakingContract, signer);
    const stakingHelper = new ethers.Contract(addresses.STAKING_HELPER_ADDRESS, StakingHelperContract, signer);

    let stakeTx;
    let forfeitTx;

    try {
      const gasPrice = await getGasPrice(provider);

      if (action === "stake") {
        stakeTx = await stakingHelper.stake(ethers.utils.parseUnits(value, "gwei"), address, { gasPrice });
      } else {
        stakeTx = await staking.unstake(ethers.utils.parseUnits(value, "gwei"), true, { gasPrice });
      }
      const pendingTxnType = action === "stake" ? "staking" : "unstaking";
      dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: getStakingTypeText(action), type: pendingTxnType }));
      await stakeTx.wait();
      dispatch(success({ text: messages.tx_successfully_send }));
    } catch (err: any) {
      if (err.data.message.length > 1) {
        return metamaskErrorWrap(err, dispatch);
      }
    } finally {
      if (stakeTx) {
        dispatch(clearPendingTxn(stakeTx.hash));
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
