import { Grid, Box, Zoom } from "@material-ui/core";
import React, { useState } from "react";
import "./buy.scss";
import { exchanges } from "../../constants/exchanges";

interface ExchangeUrlProps {
  dexUrl: string;
}

function Buy({ dexUrl }: ExchangeUrlProps) {
  return (
    <div className="choose-buy-view">
      <Zoom in={true}>
        <div className="choose-buy-view-card">
          <div className="choose-buy-view-card-header">
            <p className="choose-buy-view-card-title"> Get Rugged</p>
          </div>
          <iframe src={dexUrl}></iframe>
        </div>
      </Zoom>
    </div>
  );
}

export default Buy;
