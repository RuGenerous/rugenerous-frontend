import { NetworkID, BondType } from "src/lib/Bond";
import { StableBond, CustomBond } from "./stable-bond";
import { LPBond } from "./lp-bond";
import DaiImg from "src/assets/tokens/MIM.svg";
import RugDaiImg from "src/assets/tokens/RUG-MIM.svg";
import FraxImg from "src/assets/tokens/MIM.svg";
import AVAXImg from "src/assets/tokens/AVAX.svg";
import { abi as BondRugDaiContract } from "src/abi/bonds/RugDaiContract.json";
import { abi as DaiBondContract } from "src/abi/bonds/DaiContract.json";
import { abi as ReserveRugDaiContract } from "src/abi/reserves/RugDai.json";
import { abi as MimBondContract } from "src/abi/bonds/MimBondContract.json";
import { abi as EthBondContract } from "src/abi/bonds/EthContract.json";
import { abi as ierc20Abi } from "src/abi/IERC20.json";
import { getBondCalculator } from "../bond-calculator";
import { BigNumberish } from "ethers";
import { addresses } from "../../constants";

export const dai = new StableBond({
  name: "dai",
  displayName: "DAI",
  bondToken: "DAI",
  bondIconSvg: DaiImg,
  bondContractABI: DaiBondContract,
  reserveContractAbi: ierc20Abi,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x3297060E2D0F30632Ef1e3d69a0859591180FF46",
      reserveAddress: "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
    },
  },
});

export const mim = new StableBond({
  name: "mim",
  displayName: "MIM",
  bondToken: "MIM",
  bondIconSvg: FraxImg,
  bondContractABI: MimBondContract,
  reserveContractAbi: ierc20Abi,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xa5b4D4cDE70613746a0be58E3f4FfE5A449cF717",
      reserveAddress: "0x130966628846BFd36ff31a822705796e8cb8C18D",
    },
  },
});

// export const lusd = new StableBond({
//   name: "lusd",
//   displayName: "BUSD",
//   bondToken: "BUSD",
//   isAvailable: { [NetworkID.Mainnet]: false, [NetworkID.Testnet]: true },
//   bondIconSvg: LusdImg,
//   bondContractABI: LusdBondContract,
//   networkAddrs: {
//     [NetworkID.Mainnet]: {
//       bondAddress: "0x10C0f93f64e3C8D0a1b0f4B87d6155fd9e89D08D",
//       reserveAddress: "0x5f98805A4E8be255a32880FDeC7F6728C6568bA0",
//     },
//     [NetworkID.Testnet]: {
//       bondAddress: "0x3aD02C4E4D1234590E87A1f9a73B8E0fd8CF8CCa",
//       reserveAddress: "0x45754dF05AA6305114004358eCf8D04FF3B84e26",
//     },
//   },
// });

export const eth = new CustomBond({
  name: "eth",
  displayName: "AVAX",
  bondToken: "wavax",
  bondIconSvg: AVAXImg,
  bondContractABI: EthBondContract,
  reserveContractAbi: ierc20Abi, // The Standard ierc20Abi since they're normal tokens
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0xE6295201CD1ff13CeD5f063a5421c39A1D236F1c",
      reserveAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    },
  },
});

export const rug_dai = new LPBond({
  name: "rug_dai_lp",
  displayName: "RUG-DAI LP",
  bondToken: "DAI",
  bondIconSvg: RugDaiImg,
  bondContractABI: BondRugDaiContract,
  reserveContractAbi: ReserveRugDaiContract,
  networkAddrs: {
    [NetworkID.Mainnet]: {
      bondAddress: "0x5711647d244FA06a247FA7c29948a4e50192a8E3",
      reserveAddress: "0xc0123c360f000338ce3b54b600697f3584054bc1",
    },
  },
  lpUrl:
    "https://app.sushi.com/add/0x383518188c0c6d7730d91b2c03a03c837814a899/0x6b175474e89094c44da98b954eedeac495271d0f",
});

export const allBonds = [dai, mim, rug_dai, eth];
export const allBondsMap = allBonds.reduce((prevVal, bond) => {
  return { ...prevVal, [bond.name]: bond };
}, {});
export default [mim, dai, rug_dai, eth];
