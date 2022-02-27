import { Customer, CustomerModel } from '../models/customer';
import { Transaction, TransactionModel } from '../models/transaction';
import { connect } from '../services/db';

export const mockDatabase = () => connect();

export const clearDatabase = () =>
  Promise.all([CustomerModel.deleteMany({}), TransactionModel.deleteMany({})]);

export const seed = (transactions: Transaction[], customers: Customer[]) =>
  Promise.all([
    TransactionModel.insertMany(transactions),
    CustomerModel.insertMany(customers),
  ]);
