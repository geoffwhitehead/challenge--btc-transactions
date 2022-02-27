import { AccountDepositAggregation } from './data';

export const printAccountDeposits = (data: AccountDepositAggregation[]) => {
  console.log('data', JSON.stringify(data, null, 4));
};
