import { EPOCH_INTERVAL } from "src/constants";
export function getRebaseBlock(currentBlock: number) {
  return currentBlock + EPOCH_INTERVAL - (currentBlock % EPOCH_INTERVAL);
}
