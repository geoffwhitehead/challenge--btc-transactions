import { Transaction } from '../models/transaction';
import { AccountDepositAggregation } from './data';

interface PrintAccountDetails {
  accountDeposits: AccountDepositAggregation;
  smallestDeposit: Transaction | null;
  largestDeposit: Transaction | null;
}

export const printAccountDeposits = ({
  accountDeposits,
  smallestDeposit,
  largestDeposit,
}: PrintAccountDetails) => {
  accountDeposits.customers.forEach(({ customer, sum, count }) =>
    console.log(`Deposited for ${customer.name}: count=${count} sum=${sum}`)
  );
  accountDeposits.unknown.forEach(({ sum, count }) =>
    console.log(`Deposited without reference: count=${count} sum=${sum}`)
  );
  console.log(`Smallest valid deposit: ${smallestDeposit?.amount}`);
  console.log(`Largest valid deposit: ${largestDeposit?.amount}`);
};
