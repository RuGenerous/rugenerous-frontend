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
//import Swap from "@rugenerous/interface/src/pages/Swap"
function Swap() {
  const [anchorEl, setAnchorEl] = useState(null);

  const dispatch = useDispatch();
  const { provider, address, connect, chainID, checkWrongNetwork } = useWeb3Context();

  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState<string>("");

  const isAppLoading = useSelector<IReduxState, boolean>(state => state.app.loading);

  const handleClick = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);

  return (
    <div className="stake-view">
      <Zoom in={true}>
        <div className="stake-card">
          <Grid className="stake-card-grid" container direction="column" spacing={2}>
            {/* <Swap /> */}
          </Grid>
        </div>
      </Zoom>
    </div>
  );
}

export default Swap;
