import { useState } from "react";
import { getAddresses, TOKEN_DECIMALS, DEFAULD_NETWORK } from "../../../constants";
import { useSelector } from "react-redux";
import { Link, Fade, Popper } from "@material-ui/core";
import "./rug-menu.scss";
import { IReduxState } from "../../../store/slices/state.interface";
import { getTokenUrl } from "../../../helpers";

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
        <p>RUG</p>
      </div>

      <Popper className="rug-menu-popper" open={open} anchorEl={anchorEl} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <div className="tooltip">
              <Link
                className="tooltip-item"
                href={`https://swap.rug.farm/#/trade?inputCurrency=0x130966628846bfd36ff31a822705796e8cb8c18d&outputCurrency=0xb8ef3a190b68175000b74b4160d325fd5024760e`}
                target="_blank"
              >
                <p>Buy on RUG Exchange</p>
                <span className="exchange-subtext">The cheapest swap you'll make on AVAX</span>
              </Link>
              <Link
                className="tooltip-item"
                href={`https://traderjoexyz.com/#/trade?inputCurrency=0x130966628846bfd36ff31a822705796e8cb8c18d&outputCurrency=0xb8ef3a190b68175000b74b4160d325fd5024760e`}
                target="_blank"
              >
                <p>Buy on Trader Joe</p>
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
