import { useState, useCallback, SetStateAction } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, InputAdornment, OutlinedInput, Zoom } from "@material-ui/core";
import { trim } from "../../helpers";
import { redeemFromRUG, changeApproval } from "../../store/slices/redeem-thunk";
import "./redemption.scss";
import { useWeb3Context } from "../../hooks";
import { IPendingTxn, isPendingTxn, txnButtonText } from "../../store/slices/pending-txns-slice";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { messages } from "../../constants/messages";
import classnames from "classnames";
import { warning } from "../../store/slices/messages-slice";
import { IAppSlice } from "../../store/slices/app-slice";
import { isParameterPropertyDeclaration } from "typescript";

function Redemption() {
  const [anchorEl, setAnchorEl] = useState(null);

  const dispatch = useDispatch();
  const { provider, address, connect, chainID, checkWrongNetwork } = useWeb3Context();

  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState<string>("");

  const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
  const app = useSelector<IReduxState, IAppSlice>(state => state.app);
  const currentIndex = useSelector<IReduxState, number>(state => {
    return state.app.rfv;
  });
  const setRFV = useSelector<IReduxState, number>(state => {
    return state.app.setRFV;
  });
  const timeBalance = useSelector<IReduxState, string>(state => {
    return state.account.balances && state.account.balances.rug;
  });
  const timeBalanceValue = (Number(timeBalance) * setRFV) / 100;
  //Adding Durag - KM
  const redeemAllowance = useSelector<IReduxState, number>(state => {
    return state.account.redeem && state.account.redeem.rug;
  });

  const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
    return state.pendingTransactions;
  });

  const setMax = () => {
    const fullBalance = Number(timeBalance);
    setQuantity(trim(fullBalance, 4));
    console.log(quantity);
  };

  const onSeekApproval = async (token: string) => {
    if (await checkWrongNetwork()) return;

    await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  };

  const onRedeem = async (action: string) => {
    if (await checkWrongNetwork()) return;
    if (quantity === "" || parseFloat(quantity) === 0) {
      dispatch(warning({ text: action === "redeem" ? messages.before_redeem : "" }));
    } else {
      await dispatch(
        redeemFromRUG({
          address,
          action,
          value: String(quantity),
          provider,
          networkID: chainID,
        }),
      );
      setQuantity("");
    }
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "rug") return redeemAllowance > 0;
      return 0;
    },
    [redeemAllowance],
  );

  const changeView = (newView: number) => () => {
    setView(newView);
    setQuantity("");
  };

  const handleClick = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  return (
    <div className="redeem-view">
      <Zoom in={true}>
        <div className="redeem-card">
          <Grid className="redeem-card-grid" container direction="column" spacing={2}>
            <Grid item>
              <div className="redeem-card-header">
                <p className="redeem-card-header-title">Quarterly RUG Redemption (🚩, 🚩)</p>
              </div>
            </Grid>

            <Grid item>
              <div className="redeem-card-metrics">
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={4} md={4} lg={4}>
                    <div className="redeem-card-index">
                      <p className="redeem-card-metrics-title">Liquid Backing per RUG</p>
                      <p className="redeem-card-metrics-value">
                        {isAppLoading ? <Skeleton width="150px" /> : <>${trim(Number(setRFV / 100), 2)}</>}
                      </p>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </Grid>

            <div className="redeem-card-area">
              {!address && (
                <div className="redeem-card-wallet-notification">
                  <div className="redeem-card-wallet-connect-btn" onClick={connect}>
                    <p>Connect Wallet</p>
                  </div>
                  <p className="redeem-card-wallet-desc-text">
                    Connect your wallet to Redeem USDC for your RUG tokens!
                  </p>
                </div>
              )}
              {address && (
                <div>
                  <div className="redeem-card-action-area">
                    <div className="redeem-card-action-stage-btns-wrap">
                      <div
                        onClick={changeView(0)}
                        className={classnames("redeem-card-action-stage-btn", { active: !view })}
                      >
                        <p>Redeem</p>
                      </div>
                    </div>

                    <div className="redeem-card-action-row">
                      <OutlinedInput
                        type="number"
                        placeholder="Amount"
                        className="redeem-card-action-input"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        labelWidth={0}
                        endAdornment={
                          <InputAdornment position="end">
                            <div onClick={setMax} className="redeem-card-action-input-btn">
                              <p>Max</p>
                            </div>
                          </InputAdornment>
                        }
                      />

                      <div className="redeem-card-tab-panel">
                        {address && hasAllowance("rug") ? (
                          <div
                            className="redeem-card-tab-panel-btn"
                            onClick={() => {
                              if (isPendingTxn(pendingTransactions, "redeem")) return;
                              onRedeem("redeem");
                            }}
                          >
                            <p>{txnButtonText(pendingTransactions, "redeem", "Redeem USDC")}</p>
                          </div>
                        ) : (
                          <div
                            className="redeem-card-tab-panel-btn"
                            onClick={() => {
                              if (isPendingTxn(pendingTransactions, "approve_redeem")) return;
                              onSeekApproval("rug");
                            }}
                          >
                            <p>{txnButtonText(pendingTransactions, "approve_redeem", "Approve")}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="redeem-card-action-help-text">
                      {address && !hasAllowance("rug") && view === 0 && (
                        <p>
                          Note: The "Approve" transaction is only needed when redeeming for the first time, subsequent
                          redemptions only requires you to perform the "Redeem" transaction.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="redeem-user-data">
                    <div className="data-row">
                      <p className="data-row-name">Your Balance</p>
                      <p className="data-row-value">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(timeBalance), 4)} RUG</>}
                      </p>
                    </div>
                    <div className="data-row">
                      <p className="data-row-name">Your Balance Value</p>
                      <p className="data-row-value">
                        {isAppLoading ? <Skeleton width="80px" /> : <>${trim(timeBalanceValue, 4)}</>}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Grid>
        </div>
      </Zoom>
    </div>
  );
}

export default Redemption;
