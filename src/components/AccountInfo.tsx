export type Account = {
  account_id: number | undefined;
  account_name: string;
  accountsets: string[];
  is_active: boolean;
  investment: number;
  last_updated?: Date;
};

export type AccountParameters = {
  account_set: string;
  account_id: number;
  account_name: string;
  investment: number;
  balance: number;
  drawdown: number;
  equity: number;
  runningpnl: number;
  accountNo: number;
  closedpnl: number;
  insertedOn: string;
};

// export interface AccountSetProps {
//   account: Account;
//   onChange: (account: Account, action: string) => void;
//   displayAs: string;
// }

export default function AccountInfo() {
  return <></>;
}
