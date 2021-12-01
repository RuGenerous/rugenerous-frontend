import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useSelector } from "react-redux";
import { IReduxState } from "../../store/slices/state.interface";
import { IPendingTxn } from "src/store/slices/pending-txns-slice";
import { isPendingTxn, txnButtonText } from "../../store/slices/pending-txns-slice";
import "./modal.scss";

const style: any = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#3E3A71",
  border: "2px solid #2BA9AE",
  borderRadius: "15px",
  boxShadow: 24,
  p: 4,
  color: "white",
  justifyContent: "center",
  display: "inline-block",
};

export default function BasicModal(onChangeWarmup: Function) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const pendingTransactions = useSelector<IReduxState, IPendingTxn[]>(state => {
    return state.pendingTransactions;
  });

  return (
    <div>
      <Button className="forfeit-btn" onClick={handleOpen}>
        Exit Warm-Up
      </Button>
      <Modal
        className="modal-view"
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to exit the Warm-Up?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Exiting Warm-Up will return your $RUG balance to your account, but will not make you eligible for rebases on
            the current balance in warm-up.
          </Typography>
          <br />
          <br />
          <>
            <div>
              <div className="cancel-btn" onClick={handleClose}>
                <p> Cancel</p>
              </div>
              <div
                className="forfeit-btn"
                onClick={() => {
                  if (isPendingTxn(pendingTransactions, "forfeit")) return;
                  onChangeWarmup("forfeit");
                  handleClose;
                }}
              >
                <p>{txnButtonText(pendingTransactions, "forfeit", "Confirm")}</p>
              </div>
            </div>
          </>
        </Box>
      </Modal>
    </div>
  );
}
