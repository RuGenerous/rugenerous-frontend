import { useSelector } from "react-redux";
import {
  Paper,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Zoom,
} from "@material-ui/core";
import { BondTableData, BondDataCard } from "./BondRow";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { trim } from "../../helpers";
import useBonds from "../../hooks/Bonds";
import "./choosebond.scss";
import { Skeleton } from "@material-ui/lab";
import { IReduxState } from "../../store/slices/state.interface";
import classnames from "classnames";
import { useState } from "react";
import TabPanel from "../../components/TabPanel";

function ChooseBond() {
  const { bonds } = useBonds();
  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query

  const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);
  const marketPrice = useSelector<IReduxState, number>(state => {
    return state.app.marketPrice;
  });

  const treasuryBalance = useSelector<IReduxState, number>(state => {
    return state.app.treasuryBalance;
  });

  const [view, setView] = useState(0);

  const changeView = (newView: number) => () => {
    setView(newView);
  };

  return (
    <div className="choose-bond-view">
      <Zoom in={true}>
        <div className="choose-bond-view-card">
          <div className="choose-bond-view-card-header">
            <p className="choose-bond-view-card-title"> Get Rugged</p>
          </div>

          <Grid container item xs={12} spacing={2} className="choose-bond-view-card-metrics">
            <Grid item xs={12} sm={6}>
              <Box textAlign="center">
                <p className="choose-bond-view-card-metrics-title">Treasury Balance</p>
                <p className="choose-bond-view-card-metrics-value">
                  {isAppLoading ? (
                    <Skeleton width="180px" />
                  ) : (
                    new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    }).format(treasuryBalance)
                  )}
                </p>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box textAlign="center">
                <p className="choose-bond-view-card-metrics-title">RUG Price</p>
                <p className="choose-bond-view-card-metrics-value">
                  {isAppLoading ? <Skeleton width="100px" /> : `$${trim(marketPrice, 2)}`}
                </p>
              </Box>
            </Grid>
          </Grid>

          {!isSmallScreen && (
            <>
              <div className="bond-one-table">
                <div className={classnames("bond-one-table-btn", { active: !view })} onClick={changeView(0)}>
                  <p>Available Bonds</p>
                </div>
                {/* <div className={classnames("bond-one-table-btn", { active: view })} onClick={changeView(1)}>
                  <p>Sold Out / Upcoming Bonds</p>
                </div> */}
              </div>
              <TabPanel value={view} index={0}>
                <Grid container item>
                  <TableContainer className="choose-bond-view-card-table">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">
                            <p className="choose-bond-view-card-table-title">Mint</p>
                          </TableCell>
                          <TableCell align="center">
                            <p className="choose-bond-view-card-table-title">Price</p>
                          </TableCell>
                          <TableCell align="center">
                            <p className="choose-bond-view-card-table-title">ROI</p>
                          </TableCell>
                          <TableCell align="right">
                            <p className="choose-bond-view-card-table-title">Purchased</p>
                          </TableCell>
                          <TableCell align="right"></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {bonds.map(bond => bond.available && <BondTableData key={bond.name} bond={bond} />)}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </TabPanel>

              <TabPanel value={view} index={1}>
                <Grid container item>
                  <TableContainer className="choose-bond-view-card-table">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell align="center">
                            <p className="choose-bond-view-card-table-title">Mint</p>
                          </TableCell>
                          <TableCell align="center">
                            <p className="choose-bond-view-card-table-title">Price</p>
                          </TableCell>
                          <TableCell align="center">
                            <p className="choose-bond-view-card-table-title">ROI</p>
                          </TableCell>
                          <TableCell align="right">
                            <p className="choose-bond-view-card-table-title">Purchased</p>
                          </TableCell>
                          <TableCell align="right"></TableCell>
                        </TableRow>
                      </TableHead>
                      {/* <TableBody>
                        {bonds.map(bond => !bond.available && <BondTableData key={bond.name} bond={bond} />)}
                      </TableBody> */}
                    </Table>
                  </TableContainer>
                </Grid>
              </TabPanel>
            </>
          )}
        </div>
      </Zoom>

      {isSmallScreen && (
        <div className="choose-bond-view-card-container">
          <Grid container item spacing={2}>
            {bonds.map(bond => (
              <Grid item xs={12} key={bond.name}>
                <BondDataCard key={bond.name} bond={bond} />
              </Grid>
            ))}
          </Grid>
        </div>
      )}
    </div>
  );
}

export default ChooseBond;
