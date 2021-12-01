import { useState, useCallback, SetStateAction } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, InputAdornment, OutlinedInput, Zoom } from "@material-ui/core";
import RebaseTimer from "../../components/RebaseTimer";
import { trim } from "../../helpers";
import { changeStake, changeApproval } from "../../store/slices/stake-thunk";
import "./stake.scss";
import { useWeb3Context } from "../../hooks";
import { IPendingTxn, isPendingTxn, txnButtonText } from "../../store/slices/pending-txns-slice";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import { messages } from "../../constants/messages";
import classnames from "classnames";
import { warning } from "../../store/slices/messages-slice";
import { MouseEvent } from "react";
import { Popper, Fade } from "@material-ui/core";
import { forfeitOrClaim } from "../../store/slices/warmup-thunk";
import { sleep } from "../../helpers";
import WarmUpTimer from "src/components/WarmUpTimer";
import BasicModal from "../../components/Modal";

function Stake() {
  const [anchorEl, setAnchorEl] = useState(null);

  const dispatch = useDispatch();
  const { provider, address, connect, chainID, checkWrongNetwork } = useWeb3Context();

  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState<string>("");

  const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
  const currentIndex = useSelector<IReduxState, string>(state => {
    return state.app.currentIndex;
  });
  const fiveDayRate = useSelector<IReduxState, number>(state => {
    return state.app.fiveDayRate;
  });
  const timeBalance = useSelector<IReduxState, string>(state => {
    return state.account.balances && state.account.balances.time;
  });
  const warmupBalance = useSelector<IReduxState, string>(state => {
    return state.account.warmupInfo && state.account.warmupInfo.deposit;
  });
  const warmupExpiry = useSelector<IReduxState, number>(state => {
    return state.account.warmupInfo && state.account.warmupInfo.expiry;
  });
  const currentEpoch = useSelector<IReduxState, number>(state => {
    return state.account.warmupInfo && state.account.warmupInfo.epoch;
  });
  const memoBalance = useSelector<IReduxState, string>(state => {
    return state.account.balances && state.account.balances.memo;
  });
  const stakeAllowance = useSelector<IReduxState, number>(state => {
    return state.account.staking && state.account.staking.time;
  });
  const unstakeAllowance = useSelector<IReduxState, number>(state => {
    return state.account.staking && state.account.staking.memo;
  });
  const stakingRebase = useSelector<IReduxState, number>(state => {
    return state.app.stakingRebase;
  });
  const stakingAPY = useSelector<IReduxState, number>(state => {
    return state.app.stakingAPY;
  });
  const stakingTVL = useSelector<IReduxState, number>(state => {
    return state.app.stakingTVL;
  });

  const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
    return state.pendingTransactions;
  });

  const setMax = () => {
    if (view === 0) {
      const fullBalance = Number(timeBalance);
      setQuantity(trim(fullBalance, 4));
      console.log(quantity);
    } else {
      setQuantity(memoBalance);
    }
  };

  const onSeekApproval = async (token: string) => {
    if (await checkWrongNetwork()) return;

    await dispatch(changeApproval({ address, token, provider, networkID: chainID }));
  };

  const onChangeStake = async (action: string) => {
    if (await checkWrongNetwork()) return;
    if (quantity === "" || parseFloat(quantity) === 0) {
      dispatch(warning({ text: action === "stake" ? messages.before_stake : messages.before_unstake }));
    } else {
      await dispatch(
        changeStake({
          address,
          action,
          value: String(quantity),
          provider,
          networkID: chainID,
          warmUpBalance: Number(warmupBalance),
        }),
      );
      setQuantity("");
    }
  };

  const onChangeWarmup = async (action: string) => {
    if (await checkWrongNetwork()) return;
    await dispatch(
      forfeitOrClaim({
        address,
        action,
        provider,
        networkID: chainID,
      }),
    );
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "time") return stakeAllowance > 0;
      if (token === "memo") return unstakeAllowance > 0;
      return 0;
    },
    [stakeAllowance],
  );

  const changeView = (newView: number) => () => {
    setView(newView);
    setQuantity("");
  };

  const trimmedMemoBalance = trim(Number(memoBalance), 6);
  const trimmedStakingAPY = trim(stakingAPY * 100, 1);
  const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  const nextRewardValue = trim((Number(stakingRebasePercentage) / 100) * Number(trimmedMemoBalance), 6);

  const handleClick = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);

  return (
    <div className="stake-view">
      <Zoom in={true}>
        <div className="stake-card">
          <Grid className="stake-card-grid" container direction="column" spacing={2}>
            <Grid item>
              <div className="stake-card-header">
                <p className="stake-card-header-title">RUG Staking (🚩, 🚩)</p>
                <RebaseTimer />
              </div>
            </Grid>

            <Grid item>
              <div className="stake-card-metrics">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4} md={4} lg={4}>
                    <div className="stake-card-apy">
                      <p className="stake-card-metrics-title">APY</p>
                      <>
                        {stakingAPY ? (
                          <div>
                            <p
                              className="stake-card-metrics-value"
                              onMouseEnter={e => handleClick(e)}
                              onMouseLeave={e => handleClick(e)}
                            >
                              `'Big' - trust me bro...`
                            </p>

                            <Popper className="time-menu-popper tooltip" open={open} anchorEl={anchorEl} transition>
                              {({ TransitionProps }) => (
                                <Fade {...TransitionProps} timeout={200}>
                                  <p className="tooltip-item">
                                    {new Intl.NumberFormat("en-US").format(Number(trimmedStakingAPY))}%
                                  </p>
                                </Fade>
                              )}
                            </Popper>
                          </div>
                        ) : (
                          <p className="stake-card-metrics-value">
                            <Skeleton width="150px" />
                          </p>
                        )}
                      </>
                    </div>
                  </Grid>

                  <Grid item xs={6} sm={4} md={4} lg={4}>
                    <div className="stake-card-tvl">
                      <p className="stake-card-metrics-title">TVL</p>
                      <p className="stake-card-metrics-value">
                        {stakingTVL ? (
                          new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                            minimumFractionDigits: 0,
                          }).format(stakingTVL)
                        ) : (
                          <Skeleton width="150px" />
                        )}
                      </p>
                    </div>
                  </Grid>

                  <Grid item xs={6} sm={4} md={4} lg={4}>
                    <div className="stake-card-index">
                      <p className="stake-card-metrics-title">Current Index</p>
                      <p className="stake-card-metrics-value">
                        {currentIndex ? <>{trim(Number(currentIndex), 2)} RUG</> : <Skeleton width="150px" />}
                      </p>
                    </div>
                  </Grid>
                </Grid>
              </div>
            </Grid>

            <div className="stake-card-area">
              {!address && (
                <div className="stake-card-wallet-notification">
                  <div className="stake-card-wallet-connect-btn" onClick={connect}>
                    <p>Connect Wallet</p>
                  </div>
                  <p className="stake-card-wallet-desc-text">Connect your wallet to stake RUG tokens!</p>
                </div>
              )}
              {address && (
                <div>
                  <div className="stake-card-action-area">
                    <div className="stake-card-action-stage-btns-wrap">
                      <div
                        onClick={changeView(0)}
                        className={classnames("stake-card-action-stage-btn", { active: !view })}
                      >
                        <p>Stake</p>
                      </div>
                      <div
                        onClick={changeView(1)}
                        className={classnames("stake-card-action-stage-btn", { active: view })}
                      >
                        <p>Unstake</p>
                      </div>
                    </div>

                    <div className="stake-card-action-row">
                      <OutlinedInput
                        type="number"
                        placeholder="Amount"
                        className="stake-card-action-input"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        labelWidth={0}
                        endAdornment={
                          <InputAdornment position="end">
                            <div onClick={setMax} className="stake-card-action-input-btn">
                              <p>Max</p>
                            </div>
                          </InputAdornment>
                        }
                      />

                      {view === 0 && (
                        <div className="stake-card-tab-panel">
                          {address && hasAllowance("time") ? (
                            <div
                              className="stake-card-tab-panel-btn"
                              onClick={() => {
                                if (isPendingTxn(pendingTransactions, "staking")) return;
                                onChangeStake("stake");
                              }}
                            >
                              <p>{txnButtonText(pendingTransactions, "staking", "Stake RUG")}</p>
                            </div>
                          ) : (
                            <div
                              className="stake-card-tab-panel-btn"
                              onClick={() => {
                                if (isPendingTxn(pendingTransactions, "approve_staking")) return;
                                onSeekApproval("time");
                              }}
                            >
                              <p>{txnButtonText(pendingTransactions, "approve_staking", "Approve")}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {view === 1 && (
                        <div className="stake-card-tab-panel">
                          {address && hasAllowance("memo") ? (
                            <div
                              className="stake-card-tab-panel-btn"
                              onClick={() => {
                                if (isPendingTxn(pendingTransactions, "unstaking")) return;
                                onChangeStake("unstake");
                              }}
                            >
                              <p>{txnButtonText(pendingTransactions, "unstaking", "Unstake RUG")}</p>
                            </div>
                          ) : (
                            <div
                              className="stake-card-tab-panel-btn"
                              onClick={() => {
                                if (isPendingTxn(pendingTransactions, "approve_unstaking")) return;
                                onSeekApproval("memo");
                              }}
                            >
                              <p>{txnButtonText(pendingTransactions, "approve_unstaking", "Approve")}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="stake-card-action-help-text">
                      {address && ((!hasAllowance("time") && view === 0) || (!hasAllowance("memo") && view === 1)) && (
                        <p>
                          Note: The "Approve" transaction is only needed when staking/unstaking for the first time;
                          subsequent staking/unstaking only requires you to perform the "Stake" or "Unstake"
                          transaction.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="stake-user-data">
                    <div className="data-row">
                      <p className="data-row-name">Your Balance</p>
                      <p className="data-row-value">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(timeBalance), 4)} RUG</>}
                      </p>
                    </div>

                    {Number(warmupBalance) > 0 && (
                      <>
                        <br />
                        <div className="data-row">
                          <p className="data-row-name">Your Warm Up Balance</p>
                          <p className="data-row-value">
                            {isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(warmupBalance), 4)} RUG</>}
                          </p>
                        </div>

                        <div className="data-row">
                          <p className="data-row-name">Pending Warm Up Till Release</p>
                          <p className="data-row-value">
                            {isAppLoading ? (
                              <Skeleton width="80px" />
                            ) : Number(warmupExpiry) <= currentEpoch ? (
                              <>
                                <div
                                  className="claim-btn"
                                  onClick={() => {
                                    if (isPendingTxn(pendingTransactions, "claim")) return;
                                    onChangeWarmup("claim");
                                  }}
                                >
                                  <p>{txnButtonText(pendingTransactions, "claim", "Claim SRUG")}</p>
                                </div>

                                <br />
                              </>
                            ) : (
                              <>
                                {" "}
                                {WarmUpTimer()}
                                <div className="forfeit-btn">{BasicModal(onChangeWarmup)}</div>
                              </>
                            )}
                          </p>
                        </div>
                      </>
                    )}

                    <div className="data-row">
                      <p className="data-row-name">Your Staked Balance</p>
                      <p className="data-row-value">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trimmedMemoBalance} RUGGED (SRUG)</>}
                      </p>
                    </div>

                    <div className="data-row">
                      <p className="data-row-name">Next Reward Amount</p>
                      <p className="data-row-value">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{nextRewardValue} RUGGED (SRUG)</>}
                      </p>
                    </div>

                    <div className="data-row">
                      <p className="data-row-name">Next Reward Yield</p>
                      <p className="data-row-value">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{stakingRebasePercentage}%</>}
                      </p>
                    </div>

                    <div className="data-row">
                      <p className="data-row-name">ROI (5-Day Rate)</p>
                      <p className="data-row-value">
                        {isAppLoading ? <Skeleton width="80px" /> : <>{trim(Number(fiveDayRate) * 100, 4)}%</>}
                      </p>
                    </div>

                    <div className="stake-card-action-help-text">
                      <br />
                      <p>
                        Note: There is a 8-Hour warm-up staking period, where users must be staked for more than 8 hours
                        before receiving any rebase rewards. When 8 hours has surpassed your staked balance can be
                        claimed from the warm up contract and you will automatically receive the rebase rewards
                        thereafter.
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

export default Stake;
