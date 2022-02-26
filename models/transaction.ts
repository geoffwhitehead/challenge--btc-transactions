import { Schema, model } from 'mongoose';

export interface Transaction {
  involvesWatchonly: boolean;
  account: string;
  address: string;
  category: TransactionCategory;
  amount: number;
  label: string;
  confirmations: number;
  blockhash: string;
  blockindex: number;
  blocktime: number;
  txid: string;
  vout: number;
  walletconflicts: string[];
  time: number;
  timereceived: number;
  'bip125-replaceable': string;
}

const transactionCategory = {
  receive: 'receive',
  send: 'send',
} as const;

type TransactionCategory = keyof typeof transactionCategory;

const schema = new Schema<Transaction>({
  involvesWatchonly: { type: Boolean, required: true },
  account: { type: String },
  address: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  label: { type: String },
  confirmations: { type: Number, required: true },
  blockhash: { type: String, required: true },
  blockindex: { type: Number, required: true },
  blocktime: { type: Number, required: true },
  txid: { type: String, required: true },
  vout: { type: Number, required: true },
  walletconflicts: { type: [String], required: true },
  time: { type: Number, required: true },
  timereceived: { type: Number, required: true },
  'bip125-replaceable': { type: String, required: true },
});

export const TransactionModel = model<Transaction>('Transaction', schema);
