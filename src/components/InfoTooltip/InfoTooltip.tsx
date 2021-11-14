import { SetStateAction, useState } from "react";
import { ReactComponent as Info } from "../../assets/icons/info.svg";
import { SvgIcon, Paper, Typography, Box, Popper, SvgIconTypeMap } from "@material-ui/core";
import "./infotooltip.scss";

type Props = {
  message: any
}

function InfoTooltip({ message }: Props) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleHover = (e: React.MouseEvent<SVGSVGElement>) => {
    setAnchorEl(anchorEl);
  };

  const open = Boolean(anchorEl);
  const id = open ? "info-tooltip" : undefined;

  return (
    <Box style={{ display: "inline-flex", justifyContent: "center", alignSelf: "center" }}>
      <SvgIcon
        component={Info}
        onMouseOver={handleHover}
        onMouseOut={handleHover}
        style={{ margin: "0 5px", fontSize: "1em" }}
        className="info-icon"
      ></SvgIcon>
      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom" className="tooltip">
        <Paper className="info-tooltip ohm-card">
          <Typography variant="body2" className="info-tooltip-text">
            {message}
          </Typography>
        </Paper>
      </Popper>
    </Box>
  );
}

export default InfoTooltip;
