import { AccountDepositAggregation } from './data';

export const printAccountDeposits = (
  accountDeposits: AccountDepositAggregation
) => {
  // console.log('data', JSON.stringify(accountDeposits, null, 4));
  accountDeposits.customers.forEach(({ customer, sum, count }) =>
    console.log(`Deposited for ${customer.name}: count=${count} sum=${sum}`)
  );
  accountDeposits.unknown.forEach(({ sum, count }) =>
    console.log(`Deposited without reference: count=${count} sum=${sum}`)
  );
};
