import { Modal, Paper, SvgIcon, IconButton } from "@material-ui/core";
import { useState } from "react";
import { ReactComponent as XIcon } from "../../assets/icons/x.svg";
import "./wrap.scss";
import { useDispatch } from "react-redux";
import { calcWrapDetails } from "../../store/slices/wrap-slice";
import { useWeb3Context } from "../../hooks";
import SrugToDurag, { SrugToDuragPrice } from "./components/SrugtoDurag";
import RugToSrug, { RugToSrugPrice } from "./components/RugtoSrug";
import classnames from "classnames";

interface IAdvancedSettingsProps {
  open: boolean;
  handleClose: () => void;
}

function Wrap({ open, handleClose }: IAdvancedSettingsProps) {
  const dispatch = useDispatch();
  const { provider, chainID } = useWeb3Context();

  const [value, setValue] = useState("");
  const [isWrap, setIsWrap] = useState(true);
  const [isWrapPrice, setIsWrapPrice] = useState(true);
  const [view, setView] = useState(1);

  const onClose = () => {
    setValue("");
    setIsWrap(true);
    setIsWrapPrice(true);
    dispatch(calcWrapDetails({ isWrap, provider, value: "", networkID: chainID }));
    handleClose();
  };

  const changeView = (newView: number) => () => {
    setView(newView);
    setValue("");
    setIsWrap(true);
    setIsWrapPrice(true);
    dispatch(calcWrapDetails({ isWrap, provider, value: "", networkID: chainID }));
  };

  return (
    <Modal id="hades" open={open} onClose={onClose} hideBackdrop>
      <Paper className="ohm-card ohm-popover wrap-token-poper">
        <div className="cross-wrap wrap-cros-wrap">
          <IconButton onClick={onClose}>
            <SvgIcon color="primary" component={XIcon} />
          </IconButton>
          {view === 0 && <RugToSrugPrice isWrapPrice={isWrapPrice} setIsWrapPrice={status => setIsWrapPrice(status)} />}
          {view === 1 && (
            <SrugToDuragPrice isWrapPrice={isWrapPrice} setIsWrapPrice={status => setIsWrapPrice(status)} />
          )}
        </div>
        <div className="stake-card-action-stage-btns-wrap">
          <div onClick={changeView(0)} className={classnames("stake-card-action-stage-btn", { active: !view })}>
            <p>RUG to SRUG</p>
          </div>
          <div onClick={changeView(1)} className={classnames("stake-card-action-stage-btn", { active: view })}>
            <p>SRUG to DURAG</p>
          </div>
        </div>
        {view === 0 && (
          <RugToSrug
            isWrap={isWrap}
            setValue={value => setValue(value)}
            setIsWrap={value => setIsWrap(value)}
            setIsWrapPrice={value => setIsWrapPrice(value)}
            value={value}
          />
        )}
        {view === 1 && (
          <SrugToDurag
            isWrap={isWrap}
            setValue={value => setValue(value)}
            setIsWrap={value => setIsWrap(value)}
            setIsWrapPrice={value => setIsWrapPrice(value)}
            value={value}
          />
        )}
      </Paper>
    </Modal>
  );
}

export default Wrap;
