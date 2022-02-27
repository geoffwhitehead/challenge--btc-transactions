import { importer } from './import';
import { getAccountDeposits } from './data';
import { printAccountDeposits } from './print';
import { TransactionModel } from '../models/transaction';
import { CustomerModel } from '../models/customer';

const TRANSACTION_DIRS = [
  'data/transactions-1.json',
  'data/transactions-2.json',
];
const CUSTOMER_DIRS = ['data/customers.json'];

export const start = async () => {
  // clear db
  await Promise.all([
    CustomerModel.deleteMany({}),
    TransactionModel.deleteMany({}),
  ]);

  // import data
  await importer(CUSTOMER_DIRS, CustomerModel, 'customers.*');
  await importer(TRANSACTION_DIRS, TransactionModel, 'transactions.*');

  // get aggregation data
  const data = await getAccountDeposits();

  // output to console
  printAccountDeposits(data);
};
