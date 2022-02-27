import { importer } from './import';
import {
  getAccountDeposits,
  getLargestValidDeposit,
  getSmallestValidDeposit,
} from './data';
import { printAccountDeposits } from './print';
import { TransactionModel } from '../models/transaction';
import { CustomerModel } from '../models/customer';

const TRANSACTION_DIRS = [
  'data/transactions-1.json',
  'data/transactions-2.json',
];
const CUSTOMER_DIRS = ['data/customers.json'];

export const start = async () => {
  // import data
  await importer(CUSTOMER_DIRS, CustomerModel, 'customers.*');
  await importer(TRANSACTION_DIRS, TransactionModel, 'transactions.*');

  // query account data
  const accountDeposits = await getAccountDeposits();
  const smallestDeposit = await getSmallestValidDeposit();
  const largestDeposit = await getLargestValidDeposit();

  // output to console
  printAccountDeposits({ accountDeposits, smallestDeposit, largestDeposit });
};
