import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IReduxState } from "../../../store/slices/state.interface";
import { trim } from "../../../helpers/trim";
import { ReactComponent as ArrowsIcon } from "../../../assets/icons/arrow-down.svg";
import { useWeb3Context } from "../../../hooks";
import { changeStake, changeApproval } from "../../../store/slices/stake-thunk";
import { warning } from "src/store/slices/messages-slice";
import { messages } from "../../../constants/messages";
import { Skeleton } from "@material-ui/lab";
import { Icon, IconButton, InputAdornment, OutlinedInput, SvgIcon } from "@material-ui/core";
import { IPendingTxn, isPendingTxn, txnButtonText } from "../../../store/slices/pending-txns-slice";

interface SrugToWsrugProps {
  isWrap: boolean;
  setValue: (value: string) => void;
  setIsWrap: (value: boolean) => void;
  setIsWrapPrice: (value: boolean) => void;
  value: string;
}

export default function ({ isWrap, setValue, setIsWrap, setIsWrapPrice, value }: SrugToWsrugProps) {
  const dispatch = useDispatch();
  const { provider, address, chainID, checkWrongNetwork } = useWeb3Context();

  const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);

  const rugBalance = useSelector<IReduxState, string>(state => {
    return state.account.balances && state.account.balances.rug;
  });

  const srugBalance = useSelector<IReduxState, string>(state => {
    return state.account.balances && state.account.balances.srug;
  });

  const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
    return state.pendingTransactions;
  });

  const stakeAllowance = useSelector<IReduxState, number>(state => {
    return state.account.staking && state.account.staking.rug;
  });

  const unstakeAllowance = useSelector<IReduxState, number>(state => {
    return state.account.staking && state.account.staking.srug;
  });

  const setMax = () => {
    if (isWrap) {
      setValue(rugBalance);
    } else {
      setValue(srugBalance);
    }
  };

  const handleSwap = () => {
    // setValue("");
    // const value = !isWrap;
    // setIsWrap(value);
    // setIsWrapPrice(value);
  };

  const handleValueChange = (e: any) => {
    const value = e.target.value;
    setValue(value);
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "rug") return stakeAllowance > 0;
      if (token === "srug") return unstakeAllowance > 0;
      return 0;
    },
    [stakeAllowance, unstakeAllowance],
  );

  const trimmedSrugBalance = trim(Number(srugBalance), 6);
  const trimmedRugBalance = trim(Number(rugBalance), 6);

  const getBalance = () => (isWrap ? `${trimmedRugBalance} RUG` : `${trimmedSrugBalance} SRUG`);

  const onChangeStake = async (action: string) => {
    if (await checkWrongNetwork()) return;
    if (value === "" || parseFloat(value) === 0) {
      dispatch(warning({ text: action === "stake" ? messages.before_stake : messages.before_unstake }));
    } else {
      await dispatch(changeStake({ address, action, value, provider, networkID: chainID, warmUpBalance: 0 }));
      setValue("");
    }
  };

  const onSeekApproval = async (token: string) => {
    if (await checkWrongNetwork()) return;

    await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  };

  return (
    <>
      <div className="wrap-header-conteiner">
        <p className="wrap-header-title">{isWrap ? "Wrap" : "Unwrap"}</p>
        <p className="wrap-header-balance">Balance: {isAppLoading ? <Skeleton width="80px" /> : <>{getBalance()}</>}</p>
      </div>

      <div className="wrap-container">
        <OutlinedInput
          placeholder="Amount"
          value={value}
          onChange={handleValueChange}
          fullWidth
          type="number"
          className="bond-input wrap-input"
          startAdornment={
            <InputAdornment position="start">
              <div className="wrap-action-input-text">
                <p>{isWrap ? "RUG" : "SRUG"}</p>
              </div>
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <div onClick={setMax} className="wrap-action-input-btn">
                <p>Max</p>
              </div>
            </InputAdornment>
          }
        />
        <div className="wrap-toggle">
          <Icon onClick={handleSwap}>
            <SvgIcon color="primary" component={ArrowsIcon} />
          </Icon>
        </div>
        <OutlinedInput
          placeholder="Amount"
          value={value}
          disabled
          fullWidth
          type="number"
          className="bond-input wrap-input"
          startAdornment={
            <InputAdornment position="start">
              <div className="wrap-action-input-text">
                <p>{isWrap ? "SRUG" : "RUG"}</p>
              </div>
            </InputAdornment>
          }
        />
        {isWrap ? (
          hasAllowance("rug") ? (
            <div
              className="wrap-btn"
              onClick={() => {
                if (isPendingTxn(pendingTransactions, "staking")) return;
                onChangeStake("stake");
              }}
            >
              <p>{txnButtonText(pendingTransactions, "staking", "Wrap")}</p>
            </div>
          ) : (
            <div
              className="wrap-btn"
              onClick={() => {
                if (isPendingTxn(pendingTransactions, "approve_staking")) return;
                onSeekApproval("rug");
              }}
            >
              <p>{txnButtonText(pendingTransactions, "approve_staking", "Approve")}</p>
            </div>
          )
        ) : hasAllowance("srug") ? (
          <div
            className="wrap-btn"
            onClick={() => {
              if (isPendingTxn(pendingTransactions, "unstaking")) return;
              onChangeStake("unstake");
            }}
          >
            <p>{txnButtonText(pendingTransactions, "unstaking", "Unwrap")}</p>
          </div>
        ) : (
          <div
            className="wrap-btn"
            onClick={() => {
              if (isPendingTxn(pendingTransactions, "approve_unstaking")) return;
              onSeekApproval("srug");
            }}
          >
            <p>{txnButtonText(pendingTransactions, "approve_unstaking", "Approve")}</p>
          </div>
        )}
        {((!hasAllowance("rug") && isWrap) || (!hasAllowance("srug") && !isWrap)) && (
          <div className="wrap-help-text">
            <p>The "Approve" transaction is only needed</p>
            <p>when wrapping for the first time.</p>
          </div>
        )}
      </div>
    </>
  );
}

interface RugToSrugPriceProps {
  isWrapPrice: boolean;
  setIsWrapPrice: (status: boolean) => void;
}

export const RugToSrugPrice = ({ isWrapPrice, setIsWrapPrice }: RugToSrugPriceProps) => {
  return (
    <div className="wrap-price" onClick={() => setIsWrapPrice(!isWrapPrice)}>
      <p>
        1 {isWrapPrice ? "RUG" : "SRUG"} = {`1 ${isWrapPrice ? "SRUG" : "RUG"}`}
      </p>
    </div>
  );
};
