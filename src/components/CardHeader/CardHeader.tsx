import { Box, Typography } from "@material-ui/core";
// import "./cardheader.scss";

type Props = {
  title: string,
  children: JSX.Element,
}

const CardHeader = ({ title, children }: Props) => {

    <Box className={`card-header`}>
      <Typography variant="h5">{title}</Typography>
      {children}
    </Box>
};

export default CardHeader;
