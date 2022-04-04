import { useEffect, useState, useCallback } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAddress, useWeb3Context } from "../hooks";
import { calcBondDetails } from "../store/slices/bond-slice";
import { loadAppDetails } from "../store/slices/app-slice";
import {
  loadAccountDetails,
  calculateUserBondDetails,
  calculateUserTokenDetails,
  loadWarmUpInfo,
} from "../store/slices/account-slice";
import { IReduxState } from "../store/slices/state.interface";
import Loading from "../components/Loader";
import useBonds from "../hooks/Bonds";
import ViewBase from "../components/ViewBase";
import { Stake, ChooseBond, Bond, Dashboard, NotFound, Calculator, Buy, Redemption } from "../views";
import "./style.scss";
import useTokens from "../hooks/tokens";
import { exchanges } from "../constants/exchanges";

function App() {
  const dispatch = useDispatch();

  const { connect, provider, hasCachedProvider, chainID, connected } = useWeb3Context();
  const address = useAddress();

  const [walletChecked, setWalletChecked] = useState(false);

  const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
  const isAppLoaded = useSelector<IReduxState, boolean>(state => !Boolean(state.app.marketPrice));

  const { bonds } = useBonds();
  const { tokens } = useTokens();

  async function loadDetails(whichDetails: string) {
    let loadProvider = provider;

    if (whichDetails === "app") {
      loadApp(loadProvider);
    }

    if (whichDetails === "account" && address && connected) {
      loadAccount(loadProvider);
      if (isAppLoaded) return;

      loadApp(loadProvider);
    }

    if (whichDetails === "userBonds" && address && connected) {
      bonds.map(bond => {
        dispatch(calculateUserBondDetails({ address, bond, provider, networkID: chainID }));
      });
    }

    if (whichDetails === "userTokens" && address && connected) {
      tokens.map(token => {
        dispatch(calculateUserTokenDetails({ address, token, provider, networkID: chainID }));
      });
    }
  }

  const loadApp = useCallback(
    loadProvider => {
      dispatch(loadAppDetails({ networkID: chainID, provider: loadProvider }));
      dispatch(loadWarmUpInfo({ networkID: chainID, address, provider: loadProvider }));
      bonds.map(bond => {
        dispatch(calcBondDetails({ bond, value: null, provider: loadProvider, networkID: chainID }));
      });
      tokens.map(token => {
        dispatch(calculateUserTokenDetails({ address: "", token, provider, networkID: chainID }));
      });
    },
    [connected],
  );

  const loadAccount = useCallback(
    loadProvider => {
      dispatch(loadAccountDetails({ networkID: chainID, address, provider: loadProvider }));
    },
    [connected],
  );

  useEffect(() => {
    if (hasCachedProvider()) {
      connect().then(() => {
        setWalletChecked(true);
      });
    } else {
      setWalletChecked(true);
    }
  }, []);

  useEffect(() => {
    if (walletChecked) {
      loadDetails("app");
      loadDetails("account");
      loadDetails("userBonds");
      loadDetails("userTokens");
    }
  }, [walletChecked]);

  useEffect(() => {
    if (connected) {
      loadDetails("app");
      loadDetails("account");
      loadDetails("userBonds");
      loadDetails("userTokens");
    }
  }, [connected]);

  if (isAppLoading) return <Loading />;

  return (
    <ViewBase>
      <Switch>
        <Route exact path="/dashboard">
          <Dashboard />
        </Route>

        <Route exact path="/">
          <Redirect to="/stake" />
        </Route>

        <Route path="/stake">
          <Stake />
        </Route>

        <Route path="/calculator">
          <Calculator />
        </Route>

        <Route path="/redeem">
          <Redemption />
        </Route>

        <Route path="/buy/rugDexUSDC">
          <Buy dexUrl={exchanges.rugDexUSDC} />
        </Route>

        <Route path="/buy/tjDex">
          <Buy dexUrl={exchanges.tjDex} />
        </Route>

        <Route path="/mints">
          {bonds.map(bond => {
            return (
              <Route exact key={bond.name} path={`/mints/${bond.name}`}>
                <Bond bond={bond} />
              </Route>
            );
          })}
          <ChooseBond />
        </Route>

        <Route component={NotFound} />
      </Switch>
    </ViewBase>
  );
}

export default App;
