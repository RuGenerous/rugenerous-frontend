import { Grid, Box, Zoom } from "@material-ui/core";
import React, { useState } from "react";
import "./buy.scss";

function Buy() {
  const urlRegDex = "https://swap.rug.farm";
  const c =
    "https://traderjoexyz.com/#/trade?inputCurrency=0x130966628846bfd36ff31a822705796e8cb8c18d&amp;outputCurrency=0xb8ef3a190b68175000b74b4160d325fd5024760e#swap-page";
  const [dexUrl, setValue] = useState(urlRegDex);

  const handleSetUrl = (url) => {
    setValue(url);
  };

  return (
    <div className="choose-buy-view">
      <Zoom in={true}>
        <div className="choose-buy-view-card">
          <div className="choose-buy-view-card-header">
            <p className="choose-buy-view-card-title"> Get Rugged</p>
          </div>
          <Grid container item xs={12} spacing={2} className="choose-buy-view-buttons">
            <Grid item xs={12} sm={6}>
              <Box textAlign="center">
                <input type="button" value="Rug Dex" className="stake-card-tab-panel-btn" onClick={handleSetUrl(urlRegDex)} />
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box textAlign="center">
                <input type="button" value="TraderJoe" className="stake-card-tab-panel-btn" onClick={handleSetUrl(handleSetUrl)} />
              </Box>
            </Grid>
          </Grid>
          <iframe src={dexUrl}></iframe>
        </div>
      </Zoom>
    </div>
  );
}

export default Buy;
