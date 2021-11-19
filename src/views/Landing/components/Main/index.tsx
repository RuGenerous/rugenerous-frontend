import React from "react";
import { Link } from "@material-ui/core";
import "./main.scss";

function Main() {
  return (
    <div className="landing-main">
      <div className="landing-main-title-wrap">
        <p>R U Generous?</p>
      </div>
      <div className="landing-main-btns-wrap">
        <Link href="https://app.rug.farm" target="_blank" rel="noreferrer">
          <div className="landing-main-btn">
            <p>Enter App</p>
          </div>
        </Link>
        <Link href="https://docs.rug.farm/" target="_blank" rel="noreferrer">
          <div className="landing-main-btn">
            <p>Documentation</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Main;
