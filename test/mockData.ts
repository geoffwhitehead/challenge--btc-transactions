import { Transaction } from '../models/transaction';

export const generateTransaction = (
  transaction: Partial<Transaction>
): Transaction => {
  return {
    involvesWatchonly: true,
    account: '',
    address: 'abc',
    category: 'receive',
    amount: 1.1,
    label: '',
    confirmations: 10,
    blockhash: 'hashabc',
    blockindex: 20,
    blocktime: 1627607548873,
    txid: 'txidabc',
    vout: 63,
    walletconflicts: [],
    time: 1627607521059,
    timereceived: 1627607521059,
    'bip125-replaceable': 'no',
    ...transaction,
  };
};
