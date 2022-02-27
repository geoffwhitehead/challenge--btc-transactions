import { Customer } from '../models/customer';
import { Transaction, TransactionModel } from '../models/transaction';

export interface AccountDepositAggregation {
  unknown: GroupedByAccount[];
  customers: GroupedByAccountCustomer[];
}

interface GroupedByAccountCustomer extends GroupedByAccount {
  customer: Customer;
}

interface GroupedByAccount {
  _id: string;
  count: number;
  sum: number;
}

const REQUIRED_CONFIRMATIONS = 6;

export const getAccountDeposits = async () => {
  const data = await TransactionModel.aggregate<AccountDepositAggregation>([
    {
      $match: {
        confirmations: { $gte: REQUIRED_CONFIRMATIONS },
        category: 'receive',
      },
    },
    {
      $group: {
        _id: '$address',
        count: { $sum: 1 },
        sum: { $sum: '$amount' },
      },
    },
    {
      $lookup: {
        from: 'customers',
        localField: '_id',
        foreignField: 'address',
        as: 'customer',
      },
    },
    {
      $unwind: {
        path: '$customer',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $facet: {
        unknown: [
          {
            $match: { customer: { $exists: false } },
          },
          {
            $group: {
              _id: '$unknown',
              count: { $sum: '$count' },
              sum: { $sum: '$sum' },
            },
          },
        ],
        customers: [
          {
            $match: { customer: { $exists: true } },
          },
        ],
      },
    },
  ]);

  return data[0];
};

export const getSmallestValidDeposit =
  async (): Promise<Transaction | null> => {
    const data = await TransactionModel.find({
      confirmations: { $gte: REQUIRED_CONFIRMATIONS },
      category: 'receive',
    })
      .sort({ amount: 1 })
      .limit(1);
    return data?.[0] || null;
  };

export const getLargestValidDeposit = async (): Promise<Transaction | null> => {
  const data = await TransactionModel.find({
    confirmations: { $gte: REQUIRED_CONFIRMATIONS },
    category: 'receive',
  })
    .sort({ amount: -1 })
    .limit(1);
  return data?.[0] || null;
};
