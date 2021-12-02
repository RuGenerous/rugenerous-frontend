import { useSelector } from "react-redux";
import { secondsUntilBlock, prettifySeconds } from "../../helpers";
import { Box } from "@material-ui/core";
import "./warmuptimer.scss";
import { Skeleton } from "@material-ui/lab";
import { useMemo } from "react";
import { IReduxState } from "../../store/slices/state.interface";

function WarmUpTimer() {
  const currentBlockTime = useSelector<IReduxState, number>(state => {
    return state.app.currentBlockTime;
  });

  const nextRebase = useSelector<IReduxState, number>(state => {
    return state.app.nextRebase;
  });

  const timeUntilRebase = useMemo(() => {
    if (currentBlockTime && nextRebase) {
      const seconds = secondsUntilBlock(currentBlockTime, nextRebase) * 2;
      return prettifySeconds(seconds);
    }
  }, [currentBlockTime, nextRebase]);

  return (
    <Box className="rebase-timer">
      <p>
        {currentBlockTime ? (
          timeUntilRebase ? (
            <>
              <strong>{timeUntilRebase}</strong> till claimable
            </>
          ) : (
            <strong>Rebasing</strong>
          )
        ) : (
          <Skeleton width="200px" />
        )}
      </p>
    </Box>
  );
}

export default WarmUpTimer;
