import { Networks } from "../../constants/blockchain";
import { LPBond, CustomLPBond } from "./lp-bond";
import { StableBond, CustomBond } from "./stable-bond";

import MimIcon from "../../assets/tokens/MIM.svg";
import AvaxIcon from "../../assets/tokens/AVAX.svg";
import MimRugIcon from "../../assets/tokens/RUG-MIM.svg";
import AvaxRugIcon from "../../assets/tokens/RUG-AVAX.svg";

import {
  StableBondContract,
  LpBondContract,
  WavaxBondContract,
  StableReserveContract,
  LpReserveContract,
} from "../../abi";

export const mim = new StableBond({
  name: "mim",
  displayName: "MIM",
  bondToken: "MIM",
  bondIconSvg: MimIcon,
  bondContractABI: StableBondContract,
  reserveContractAbi: StableReserveContract,
  networkAddrs: {
    [Networks.AVAX]: {
      bondAddress: "0xB18ab414499E732554f67698d9214d3f5f1DCc73",
      reserveAddress: "0x130966628846BFd36ff31a822705796e8cb8C18D",
    },
  },
});

export const wavax = new CustomBond({
  name: "wavax",
  displayName: "wAVAX",
  bondToken: "AVAX",
  bondIconSvg: AvaxIcon,
  bondContractABI: WavaxBondContract,
  reserveContractAbi: StableReserveContract,
  networkAddrs: {
    [Networks.AVAX]: {
      bondAddress: "0xE02B1AA2c4BE73093BE79d763fdFFC0E3cf67318",
      reserveAddress: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    },
  },
});

export const mimRug = new LPBond({
  name: "mim_time_lp",
  displayName: "RUG-MIM LP",
  bondToken: "MIM",
  bondIconSvg: MimRugIcon,
  bondContractABI: LpBondContract,
  reserveContractAbi: LpReserveContract,
  networkAddrs: {
    [Networks.AVAX]: {
      bondAddress: "0xD17Ac52710F77249D39F72bcbc0c3Fa7eefceF84",
      reserveAddress: "0x8b667C1e422c08f9874709939Bc90E71c2BEA167",
    },
  },
  lpUrl:
    "https://www.traderjoexyz.com/#/pool/0x130966628846BFd36ff31a822705796e8cb8C18D/0xb54f16fB19478766A268F172C9480f8da1a7c9C3",
});

export const avaxRug = new CustomLPBond({
  name: "avax_rug_lp",
  displayName: "RUG-AVAX LP",
  bondToken: "AVAX",
  bondIconSvg: AvaxRugIcon,
  bondContractABI: LpBondContract,
  reserveContractAbi: LpReserveContract,
  networkAddrs: {
    [Networks.AVAX]: {
      bondAddress: "0xD00514CeF58A5c56210051a9c7634d35eBe40FCf",
      reserveAddress: "0xaef4b048a500140be5f612d43f1bc13dfc987b30",
    },
  },
  lpUrl: "https://www.traderjoexyz.com/#/pool/AVAX/0xb54f16fB19478766A268F172C9480f8da1a7c9C3",
});

export default [mim, wavax, mimRug, avaxRug];