import { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import Social from "./social";
import StakeIcon from "../../../assets/icons/stake.svg";
import BondIcon from "../../../assets/icons/bond.svg";
import RugenerousIcon from "../../../assets/rugNoBg.png";
import DashboardIcon from "../../../assets/icons/dashboard.svg";
import ForumIcon from "../../../assets/icons/forum.svg";
import { trim, shorten } from "../../../helpers";
import { useAddress } from "../../../hooks";
import useBonds from "../../../hooks/Bonds";
import { Link } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import "./drawer-content.scss";
import DocsIcon from "../../../assets/icons/stake.svg";
import BrowserIcon from "../../../assets/icons/browser.png";
import BurgerIcon from "../../../assets/icons/hamburger.svg";
import classnames from "classnames";

function NavContent() {
  const [isActive] = useState();
  const address = useAddress();
  const { bonds } = useBonds();

  const checkPage = useCallback((location: any, page: string): boolean => {
    const currentPath = location.pathname.replace("/", "");
    if (currentPath.indexOf("dashboard") >= 0 && page === "dashboard") {
      return true;
    }
    if (currentPath.indexOf("stake") >= 0 && page === "stake") {
      return true;
    }
    if (currentPath.indexOf("mints") >= 0 && page === "mints") {
      return true;
    }
    return false;
  }, []);

  return (
    <div className="dapp-sidebar">
      <div className="branding-header ">
        <Link href="https://www.rug.farm" target="_blank">
          <img className="logo-style" alt="" src={RugenerousIcon} />
        </Link>

        {address && (
          <div className="wallet-link">
            <Link href={`https://cchain.explorer.avax.network/address/${address}`} target="_blank">
              <p>{shorten(address)}</p>
            </Link>
          </div>
        )}
      </div>

      <div className="dapp-menu-links">
        <div className="dapp-nav">
          <Link
            component={NavLink}
            to="/dashboard"
            isActive={(match: any, location: any) => {
              return checkPage(location, "dashboard");
            }}
            className={classnames("button-dapp-menu", { active: isActive })}
          >
            <div className="dapp-menu-item">
              <img alt="" src={DashboardIcon} />
              <p>Definitely Real Stats</p>
            </div>
          </Link>

          <Link
            component={NavLink}
            to="/stake"
            isActive={(match: any, location: any) => {
              return checkPage(location, "stake");
            }}
            className={classnames("button-dapp-menu", { active: isActive })}
          >
            <div className="dapp-menu-item">
              <img alt="" src={StakeIcon} />
              <p>A Ponzi Yield</p>
            </div>
          </Link>

          <Link
            component={NavLink}
            id="bond-nav"
            to="/mints"
            isActive={(match: any, location: any) => {
              return checkPage(location, "mints");
            }}
            className={classnames("button-dapp-menu", { active: isActive })}
          >
            <div className="dapp-menu-item">
              <img alt="" src={BondIcon} />
              <p>Some Ruggy Mints</p>
            </div>
          </Link>

          <div className="bond-discounts">
            <p>
              <strong>Mint discounts</strong>
            </p>
            {bonds.map((bond, i) => (
              <Link component={NavLink} to={`/mints/${bond.name}`} key={i} className={"bond"}>
                {!bond.bondDiscount ? (
                  <Skeleton variant="text" width={"150px"} />
                ) : (
                  <p>
                    {bond.displayName}
                    <span className="bond-pair-roi">
                      {bond.bondPrice < 10000000
                        ? `${bond.bondDiscount && trim(bond.bondDiscount * 100, 2)}%`
                        : "Sold Out"}
                    </span>
                  </p>
                )}
              </Link>
            ))}
          </div>

          <Link
            component={NavLink}
            id="bond-nav"
            to="/calculator"
            isActive={(match: any, location: any) => {
              return checkPage(location, "calculator");
            }}
            className={classnames("button-dapp-menu", { active: isActive })}
          >
            <div className="dapp-menu-item">
              <img alt="" src={BrowserIcon} />
              <p>Calculator</p>
            </div>
          </Link>
        </div>
      </div>
      <div className="dapp-menu-doc-link">
        <Link href="https://snapshot.org/#/saynotorug.eth" target="_blank">
          <img alt="" src={ForumIcon} />
          <p>Governance</p>
        </Link>
        <Link href="https://docs.rug.farm" target="_blank">
          <img alt="" src={DocsIcon} />
          <p>Documentation</p>
        </Link>
      </div>
      <Social />
    </div>
  );
}

export default NavContent;
