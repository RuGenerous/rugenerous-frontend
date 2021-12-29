import { useState } from "react";
import { getAddresses, TOKEN_DECIMALS, DEFAULD_NETWORK } from "../../../constants";
import { useSelector } from "react-redux";
import { Link, Fade, Popper } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import "./rug-menu.scss";
import { IReduxState } from "../../../store/slices/state.interface";
import { getTokenUrl } from "../../../helpers";
import classnames from "classnames";
import { exchanges } from "../../../constants/exchanges";

const addTokenToWallet = (tokenSymbol: string, tokenAddress: string) => async () => {
  const tokenImage = getTokenUrl(tokenSymbol.toLowerCase());

  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: TOKEN_DECIMALS,
            image: tokenImage,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
};

function TimeMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const isEthereumAPIAvailable = window.ethereum;

  const networkID = useSelector<IReduxState, number>(state => {
    return (state.app && state.app.networkID) || DEFAULD_NETWORK;
  });

  const addresses = getAddresses(networkID);

  const SRUG_ADDRESS = addresses.SRUG_ADDRESS;
  const RUG_ADDRESS = addresses.RUG_ADDRESS;

  const handleClick = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);

  return (
    <div className="rug-menu-root" onMouseEnter={e => handleClick(e)} onMouseLeave={e => handleClick(e)}>
      <div className="rug-menu-btn">
        <p>BUY RUG</p>
      </div>

      <Popper className="rug-menu-popper" open={open} anchorEl={anchorEl} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <div className="tooltip">
              {/* <Link component={NavLink} className="tooltip-item" to="/buy/rugDexUSDC">
                <p>Buy on RugSwap</p>
              </Link> */}
              <Link component={NavLink} to="/buy/tjDex" className="tooltip-item">
                <p>Buy on TradeJoe</p>
              </Link>
              {isEthereumAPIAvailable && (
                <div className="add-tokens">
                  <div className="divider" />
                  <p className="add-tokens-title">ADD TOKEN TO WALLET</p>
                  <div className="divider" />
                  <div className="tooltip-item" onClick={addTokenToWallet("RUG", RUG_ADDRESS)}>
                    <p>RUG</p>
                  </div>
                  <div className="tooltip-item" onClick={addTokenToWallet("SRUG", SRUG_ADDRESS)}>
                    <p>SRUG</p>
                  </div>
                </div>
              )}
            </div>
          </Fade>
        )}
      </Popper>
    </div>
  );
}

export default TimeMenu;
