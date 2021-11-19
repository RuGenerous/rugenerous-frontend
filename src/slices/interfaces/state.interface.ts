import { IPendingTxn } from "./pending-txns-slice";
import { IAccountSlice } from "./account-slice";
import { IAppSlice } from "../AppSlice";
import { IBondSlice } from "../BondSlice";
import { MessagesState } from "./messages-slice";

export interface IReduxState {
    pendingTransactions: IPendingTxn[];
    account: IAccountSlice;
    app: IAppSlice;
    bonding: IBondSlice;
    messages: MessagesState;
}