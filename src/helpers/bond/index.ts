import { StableBond, LPBond, NetworkID, CustomBond, BondType } from "src/lib/Bond";
import { ReactComponent as DaiImg } from "src/assets/tokens/DAI.svg";
import { ReactComponent as RugDaiImg } from "src/assets/tokens/RUG-DAI.svg";
import { ReactComponent as FraxImg } from "src/assets/tokens/FRAX.svg";
import { abi as BondRugDaiContract } from "src/abi/bonds/RugDaiContract.json";
import { abi as DaiBondContract } from "src/abi/bonds/DaiContract.json";
import { abi as ReserveRugDaiContract } from "src/abi/reserves/RugDai.json";
import { abi as MimBondContract } from "src/abi/bonds/MimBondContract.json";
import { getBondCalculator } from "../bond-calculator";


export const dai = new StableBond({
    name: "dai",
    displayName: "DAI",
    bondToken: "DAI",
    isAvailable: { [NetworkID.Mainnet]: true, [NetworkID.Testnet]: false },
    bondIconSvg: DaiImg,
    bondContractABI: DaiBondContract,
    networkAddrs: {
      [NetworkID.Mainnet]: {
        bondAddress: "0x3297060E2D0F30632Ef1e3d69a0859591180FF46",
        reserveAddress: "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
      },
      [NetworkID.Testnet]: {
        bondAddress: "0xDea5668E815dAF058e3ecB30F645b04ad26374Cf",
        reserveAddress: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C",
      },
    },
  });
  
  export const mim = new StableBond({
    name: "mim",
    displayName: "MIM",
    bondToken: "MIM",
    isAvailable: { [NetworkID.Mainnet]: true, [NetworkID.Testnet]: false },
    bondIconSvg: FraxImg,
    bondContractABI: MimBondContract,
    networkAddrs: {
      [NetworkID.Mainnet]: {
        bondAddress: "0xa5b4D4cDE70613746a0be58E3f4FfE5A449cF717",
        reserveAddress: "0x130966628846BFd36ff31a822705796e8cb8C18D",
      },
      [NetworkID.Testnet]: {
        bondAddress: "0xF651283543fB9D61A91f318b78385d187D300738",
        reserveAddress: "0x2F7249cb599139e560f0c81c269Ab9b04799E453",
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
  
  // export const eth = new CustomBond({
  //   name: "eth",
  //   displayName: "wBNB",
  //   lpUrl: "",
  //   bondType: BondType.StableAsset,
  //   bondToken: "wBNB",
  //   isAvailable: { [NetworkID.Mainnet]: true, [NetworkID.Testnet]: true },
  //   bondIconSvg: wBNBImg,
  //   bondContractABI: EthBondContract,
  //   reserveContract: ierc20Abi, // The Standard ierc20Abi since they're normal tokens
  //   networkAddrs: {
  //     [NetworkID.Mainnet]: {
  //       bondAddress: "0xE6295201CD1ff13CeD5f063a5421c39A1D236F1c",
  //       reserveAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  //     },
  //     [NetworkID.Testnet]: {
  //       bondAddress: "0xca7b90f8158A4FAA606952c023596EE6d322bcf0",
  //       reserveAddress: "0xc778417e063141139fce010982780140aa0cd5ab",
  //     },
  //   },
  //   customTreasuryBalanceFunc: async function (this: CustomBond, networkID, provider) {
  //     const ethBondContract = this.getContractForBond(networkID, provider);
  //     let ethPrice: BigNumberish = await ethBondContract.assetPrice();
  //     ethPrice = Number(ethPrice.toString()) / Math.pow(10, 8);
  //     const token = this.getContractForReserve(networkID, provider);
  //     let ethAmount: BigNumberish = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
  //     ethAmount = Number(ethAmount.toString()) / Math.pow(10, 18);
  //     return ethAmount * ethPrice;
  //   },
  // });
  
  export const rug_dai = new LPBond({
    name: "rug_dai_lp",
    displayName: "RUG-DAI LP",
    bondToken: "DAI",
    isAvailable: { [NetworkID.Mainnet]: false, [NetworkID.Testnet]: false },
    bondIconSvg: RugDaiImg,
    bondContractABI: BondRugDaiContract,
    reserveContract: ReserveRugDaiContract,
    networkAddrs: {
      [NetworkID.Mainnet]: {
        bondAddress: "0x5711647d244FA06a247FA7c29948a4e50192a8E3",
        reserveAddress: "0xc0123c360f000338ce3b54b600697f3584054bc1",
      },
      [NetworkID.Testnet]: {
        bondAddress: "0xcF449dA417cC36009a1C6FbA78918c31594B9377",
        reserveAddress: "0x8D5a22Fb6A1840da602E56D1a260E56770e0bCE2",
      },
    },
    lpUrl:
      "https://app.sushi.com/add/0x383518188c0c6d7730d91b2c03a03c837814a899/0x6b175474e89094c44da98b954eedeac495271d0f",
  });

  export const allBonds = [dai];
  export const allBondsMap = allBonds.reduce((prevVal, bond) => {
    return { ...prevVal, [bond.name]: bond };
  }, {});
export default [mim, dai];
