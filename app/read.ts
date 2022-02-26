import stream from 'stream';
import jsonstream from 'JSONStream';
import fs from 'fs';
import { Transaction, TransactionModel } from '../models/transaction';

const BATCH_LIMIT = 20;

const dirs = ['data/transactions-1.json', 'data/transactions-2.json'];

const createStream = (dir: string): stream.PassThrough =>
  fs
    .createReadStream(dir)
    .pipe(jsonstream.parse('transactions.*'))
    .pipe(
      new stream.PassThrough({
        objectMode: true,
      })
    );

const insert = async (transactions) => {
  await TransactionModel.insertMany(transactions);
};

export const readData = async () => {
  let transactions: Transaction[] = [];

  for await (const dir of dirs) {
    for await (const transaction of createStream(dir)) {
      transactions.push(transaction);
      if (transactions.length === BATCH_LIMIT) {
        await TransactionModel.insertMany(transactions);
        transactions = [];
      }
    }

    transactions.length && insert(transactions);
  }
};
