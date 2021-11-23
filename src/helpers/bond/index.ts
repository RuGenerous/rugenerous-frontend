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
      bondAddress: "0x3a93493e2E486F818672991de6828a27346Ab0Cb",
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
    "https://www.traderjoexyz.com/#/pool/0x130966628846BFd36ff31a822705796e8cb8C18D/0xb8EF3a190b68175000B74B4160d325FD5024760e",
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
      bondAddress: "0x8a4E5B690EdFa273E59f28BBE2302aCEeCeEFc41",
      reserveAddress: "0xAef4B048a500140bE5F612D43f1bC13DFC987B30",
    },
  },
  lpUrl: "https://www.traderjoexyz.com/#/pool/AVAX/0xb8EF3a190b68175000B74B4160d325FD5024760e",
});

// export const avaxQi = new CustomLPBond({
//   name: "avax_qi_lp",
//   displayName: "QI-AVAX LP",
//   bondToken: "BenQi",
//   bondIconSvg: AvaxRugIcon,
//   bondContractABI: LpBondContract,
//   reserveContractAbi: LpReserveContract,
//   networkAddrs: {
//     [Networks.AVAX]: {
//       bondAddress: "0x24Bf3F9E6FcB9761A614B9bEB7C542a7D52C8617",
//       reserveAddress: "0xE530dC2095Ef5653205CF5ea79F8979a7028065c",
//     },
//   },
//   lpUrl: "https://www.traderjoexyz.com/#/pool/AVAX/0xb8EF3a190b68175000B74B4160d325FD5024760e",
// });

export default [mim, mimRug, wavax, avaxRug];
