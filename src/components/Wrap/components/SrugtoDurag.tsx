import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IReduxState } from "../../../store/slices/state.interface";
import { trim } from "../../../helpers/trim";
import { ReactComponent as ArrowsIcon } from "../../../assets/icons/arrow-down.svg";
import { useWeb3Context } from "../../../hooks";
import { calcWrapDetails, calcWrapPrice, changeApproval, changeWrap } from "src/store/slices/wrap-slice";
import { warning } from "src/store/slices/messages-slice";
import { messages } from "../../../constants/messages";
import { Skeleton } from "@material-ui/lab";
import { Icon, InputAdornment, OutlinedInput, SvgIcon } from "@material-ui/core";
import { IPendingTxn, isPendingTxn, txnButtonText } from "../../../store/slices/pending-txns-slice";

interface SrugToDuragProps {
  isWrap: boolean;
  setValue: (value: string) => void;
  setIsWrap: (value: boolean) => void;
  setIsWrapPrice: (value: boolean) => void;
  value: string;
}

export default function ({ isWrap, setValue, setIsWrap, setIsWrapPrice, value }: SrugToDuragProps) {
  const dispatch = useDispatch();
  const { provider, address, chainID, checkWrongNetwork } = useWeb3Context();

  const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);

  const memoBalance = useSelector<IReduxState, string>(state => {
    return state.account.balances && state.account.balances.srug;
  });
  const duragBalance = useSelector<IReduxState, string>(state => {
    return state.account.balances && state.account.balances.durag;
  });

  const wrapValue = useSelector<IReduxState, string>(state => {
    return state.wrapping && state.wrapping.wrapValue;
  });

  const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
    return state.pendingTransactions;
  });

  const memoAllowance = useSelector<IReduxState, number>(state => {
    return state.account.wrapping && state.account.wrapping.srug;
  });

  const setMax = () => {
    if (isWrap) {
      setValue(memoBalance);
    } else {
      setValue(duragBalance);
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

  useEffect(() => {
    dispatch(calcWrapDetails({ isWrap, provider, value, networkID: chainID }));
  }, [value]);

  const hasAllowance = useCallback(() => memoAllowance > 0, [memoAllowance]);

  const trimmedSrugBalance = trim(Number(memoBalance), 6);
  const trimmedDuragBalance = trim(Number(duragBalance), 6);

  const getBalance = () => (isWrap ? `${trimmedSrugBalance} SRUG` : `${trimmedDuragBalance} DURAG`);

  const handleOnWrap = async () => {
    if (await checkWrongNetwork()) return;

    if (value === "" || parseFloat(value) === 0) {
      dispatch(warning({ text: isWrap ? messages.before_wrap : messages.before_unwrap }));
    } else {
      await dispatch(changeWrap({ isWrap, value, provider, networkID: chainID, address }));
      setValue("");
    }
  };

  const onSeekApproval = async () => {
    if (await checkWrongNetwork()) return;

    await dispatch(changeApproval({ address, provider, networkID: chainID }));
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
                <p>{isWrap ? "SRUG" : "DURAG"}</p>
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
          value={wrapValue}
          disabled
          fullWidth
          type="number"
          className="bond-input wrap-input"
          startAdornment={
            <InputAdornment position="start">
              <div className="wrap-action-input-text">
                <p>{isWrap ? "DURAG" : "SRUG"}</p>
              </div>
            </InputAdornment>
          }
        />
        {hasAllowance() ? (
          <div
            className="wrap-btn"
            onClick={() => {
              const inPending = isWrap
                ? isPendingTxn(pendingTransactions, "wrapping")
                : isPendingTxn(pendingTransactions, "unwrapping");
              if (inPending) return;
              handleOnWrap();
            }}
          >
            <p>
              {isWrap
                ? txnButtonText(pendingTransactions, "wrapping", "Wrap")
                : txnButtonText(pendingTransactions, "unwrapping", "Unwrap")}
            </p>
          </div>
        ) : (
          <div
            className="wrap-btn"
            onClick={() => {
              if (isPendingTxn(pendingTransactions, "approve_wrapping")) return;
              onSeekApproval();
            }}
          >
            <p>{txnButtonText(pendingTransactions, "approve_wrapping", "Approve")}</p>
          </div>
        )}
        {!hasAllowance() && (
          <div className="wrap-help-text">
            <p>The "Approve" transaction is only needed</p>
            <p>when wrapping for the first time.</p>
          </div>
        )}
      </div>
    </>
  );
}

interface SrugToDuragPriceProps {
  isWrapPrice: boolean;
  setIsWrapPrice: (status: boolean) => void;
}

export const SrugToDuragPrice = ({ isWrapPrice, setIsWrapPrice }: SrugToDuragPriceProps) => {
  const dispatch = useDispatch();
  const { provider, chainID } = useWeb3Context();

  const srugDuragPrice = useSelector<IReduxState, number>(state => {
    return state.wrapping.prices && state.wrapping.prices.srugDurag;
  });

  const duragSrugPrice = useSelector<IReduxState, number>(state => {
    return state.wrapping.prices && state.wrapping.prices.duragSrug;
  });

  const wrapPrice = isWrapPrice ? srugDuragPrice : duragSrugPrice;

  useEffect(() => {
    dispatch(calcWrapPrice({ provider, networkID: chainID }));
  }, []);

  return (
    <div className="wrap-price" onClick={() => setIsWrapPrice(!isWrapPrice)}>
      <p>
        1 {isWrapPrice ? "SRUG" : "DURAG"} = {`${trim(wrapPrice, 8)} ${isWrapPrice ? "DURAG" : "SRUG"}`}
      </p>
    </div>
  );
};
