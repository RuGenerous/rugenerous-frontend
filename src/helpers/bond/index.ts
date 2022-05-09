import { Networks } from "../../constants/blockchain";
import { LPBond, CustomLPBond } from "./lp-bond";
import { StableBond, CustomBond } from "./stable-bond";

import MimIcon from "../../assets/tokens/MIM.svg";
import USDCIcon from "../../assets/tokens/USDC.e.png";
import USDCRUGIcon from "../../assets/tokens/USDC-RUG.png";
import USDTIcon from "../../assets/tokens/USDT.e.png";
import JoeIcon from "../../assets/tokens/JOE.png";
import FXSIcon from "../../assets/tokens/FXS.png";
import AvaxIcon from "../../assets/tokens/AVAX.svg";
import MimRugIcon from "../../assets/tokens/RUG-MIM.svg";
import AvaxRugIcon from "../../assets/tokens/RUG-AVAX.svg";
import BenQiIcon from "../../assets/tokens/QI.png";
import MemoIcon from "../../assets/tokens/MEMO.png";
import TimeRugIcon from "../../assets/tokens/TIMERUG.png";

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
  available: false,
});

// export const usdc = new StableBond({
//   name: "usdc",
//   displayName: "USDC",
//   bondToken: "USDC",
//   bondIconSvg: USDCIcon,
//   bondContractABI: StableBondContract,
//   reserveContractAbi: StableReserveContract,
//   networkAddrs: {
//     [Networks.AVAX]: {
//       bondAddress: "0x790463505821987709E4C661F9aB56DEf8A6B682",
//       reserveAddress: "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664",
//     },
//   },
//   available: false,
// });

export const usdt = new StableBond({
  name: "usdt",
  displayName: "USDT",
  bondToken: "USDT",
  bondIconSvg: USDTIcon,
  bondContractABI: StableBondContract,
  reserveContractAbi: StableReserveContract,
  networkAddrs: {
    [Networks.AVAX]: {
      bondAddress: "0x8Ab416d2DC33ed848A2B3FA75293C7E3B16F056e",
      reserveAddress: "0xc7198437980c041c805a1edcba50c1ce5db95118",
    },
  },
  available: false,
});

export const benqi = new CustomBond({
  name: "benqi",
  displayName: "QI",
  bondToken: "QI",
  bondIconSvg: BenQiIcon,
  bondContractABI: StableBondContract,
  reserveContractAbi: StableReserveContract,
  networkAddrs: {
    [Networks.AVAX]: {
      bondAddress: "0x96A03Ff213D47d0556A6Bd454779E59c12722D19",
      reserveAddress: "0x8729438eb15e2c8b576fcc6aecda6a148776c0f5",
    },
  },
  available: false,
});

export const fxs = new CustomBond({
  name: "fxs",
  displayName: "FXS",
  bondToken: "FXS",
  bondIconSvg: FXSIcon,
  bondContractABI: WavaxBondContract,
  reserveContractAbi: StableReserveContract,
  networkAddrs: {
    [Networks.AVAX]: {
      bondAddress: "0x521d08bcDf82befEf0959949281dD48A78391005",
      reserveAddress: "0x214DB107654fF987AD859F34125307783fC8e387",
    },
  },
  available: true,
});

export const joe = new CustomBond({
  name: "joe",
  displayName: "JOE",
  bondToken: "JOE",
  bondIconSvg: JoeIcon,
  bondContractABI: WavaxBondContract,
  reserveContractAbi: StableReserveContract,
  networkAddrs: {
    [Networks.AVAX]: {
      bondAddress: "0xeE657E53A5cF63057A2647BD30F936FfE6Ad8Eb0",
      reserveAddress: "0x6e84a6216eA6dACC71eE8E6b0a5B7322EEbC0fDd",
    },
  },
  available: true,
});

// export const wmemo = new CustomBond({
//   name: "wmemo",
//   displayName: "WMEMO",
//   bondToken: "MEMO",
//   bondIconSvg: MemoIcon,
//   bondContractABI: StableBondContract,
//   reserveContractAbi: StableReserveContract,
//   networkAddrs: {
//     [Networks.AVAX]: {
//       bondAddress: "0x54Eac2a643927718F484176f079E364deee2a7FE",
//       reserveAddress: "0x0da67235dD5787D67955420C84ca1cEcd4E5Bb3b",
//     },
//   },
// });

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
  available: false,
});

export const mimRug = new LPBond({
  name: "mim_time_lp",
  displayName: "RUG-MIM JLP",
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
  available: false,
});

export const mimRuglp = new LPBond({
  name: "mim_rug_lp",
  displayName: "RUG-MIM LP",
  bondToken: "MIM",
  bondIconSvg: MimRugIcon,
  bondContractABI: LpBondContract,
  reserveContractAbi: LpReserveContract,
  networkAddrs: {
    [Networks.AVAX]: {
      bondAddress: "0xD93037e5230d9e6Fcd870CFCf4219891B73Db5d7",
      reserveAddress: "0x8b667C1e422c08f9874709939Bc90E71c2BEA167",
    },
  },
  lpUrl:
    "https://swap.rug.farm/#/add/0x130966628846BFd36ff31a822705796e8cb8C18D/0xb8EF3a190b68175000B74B4160d325FD5024760e",
  available: true,
});

// old mimRugRLP bondAddress: "0x6a94C5cFC9Cd43D2b43c4f2b0b82A786dF83D2Ea"

// export const usdcRugRlp = new LPBond({
//   name: "usdc_rug_rlp",
//   displayName: "RUG-USDC RLP",
//   bondToken: "USDC",
//   bondIconSvg: USDCRUGIcon,
//   bondContractABI: LpBondContract,
//   reserveContractAbi: LpReserveContract,
//   networkAddrs: {
//     [Networks.AVAX]: {
//       bondAddress: "0x845E9E30a5b6c1F3522D1489A2d8B6Cd9381bf19",
//       reserveAddress: "0x24bD0F349Da6afE313A5AbffD45fC4D107700ADB",
//     },
//   },
//   lpUrl:
//     "https://swap.rug.farm/#/add/0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664/0xb8EF3a190b68175000B74B4160d325FD5024760e",
//   available: false,
// });

//0x845E9E30a5b6c1F3522D1489A2d8B6Cd9381bf19

export const avaxRug = new CustomLPBond({
  name: "avax_rug_lp",
  displayName: "RUG-AVAX JLP",
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
  available: false,
});

// export const avaxRugRlp = new CustomLPBond({
//   name: "avax_rug_rlp",
//   displayName: "RUG-AVAX RLP",
//   bondToken: "AVAX",
//   bondIconSvg: AvaxRugIcon,
//   bondContractABI: LpBondContract,
//   reserveContractAbi: LpReserveContract,
//   networkAddrs: {
//     [Networks.AVAX]: {
//       bondAddress: "0x881A8ECe1cD45A458eAcBA97f45b0fBc0752fCBF",
//       reserveAddress: "0xB6E73230B0a8D1cAa44F186Ab8146F10ab49314A",
//     },
//   },
//   lpUrl: "https://swap.rug.farm/#/add/AVAX/0xb8EF3a190b68175000B74B4160d325FD5024760e",
//   available: true,
// });

export const timeRugRlp = new CustomLPBond({
  name: "time_rug_rlp",
  displayName: "RUG-TIME RLP",
  bondToken: "TIME",
  bondIconSvg: AvaxRugIcon,
  bondContractABI: LpBondContract,
  reserveContractAbi: LpReserveContract,
  networkAddrs: {
    [Networks.AVAX]: {
      bondAddress: "0x1e79e35b377867b89bBEFf91dc0f3f58E37376fA",
      reserveAddress: "0x133933fc4316cB5f058321898507A32248f0A007",
    },
  },
  lpUrl: "https://swap.rug.farm/#/add/AVAX/0xb8EF3a190b68175000B74B4160d325FD5024760e",
  available: false,
});

// export const timeMimRlp = new CustomLPBond({
//   name: "time_mim_rlp",
//   displayName: "MIM-TIME RLP",
//   bondToken: "TIME",
//   bondIconSvg: TimeRugIcon,
//   bondContractABI: LpBondContract,
//   reserveContractAbi: LpReserveContract,
//   networkAddrs: {
//     [Networks.AVAX]: {
//       bondAddress: "0x1e79e35b377867b89bBEFf91dc0f3f58E37376fA",
//       reserveAddress: "0x133933fc4316cB5f058321898507A32248f0A007",
//     },
//   },
//   lpUrl: "https://swap.rug.farm/#/add/AVAX/0xb8EF3a190b68175000B74B4160d325FD5024760e",
// });

// export const avaxQi = new CustomLPBond({
//   name: "avax_qi_lp",
//   displayName: "QI-AVAX LP",
//   bondToken: "QI",
//   bondIconSvg: BenQiIcon,
//   bondContractABI: LpBondContract,
//   reserveContractAbi: LpReserveContract,
//   networkAddrs: {
//     [Networks.AVAX]: {
//       bondAddress: "0x9c2d5FDD71bA16b4641A9d4B1bEe48061ec846dA",
//       reserveAddress: "0xE530dC2095Ef5653205CF5ea79F8979a7028065c",
//     },
//   },
//   lpUrl: "https://app.pangolin.exchange/add/AVAX/0x8729438eb15e2c8b576fcc6aecda6a148776c0f5",
// });

export default [fxs, joe];
