import mongoose from 'mongoose';
import { connect } from '../services/db';
import { generateTransaction } from '../test/mockData';
import { clearDatabase, mockDatabase, seed } from '../test/utils';
import {
  getAccountDeposits,
  getLargestValidDeposit,
  getSmallestValidDeposit,
} from './data';

describe('app/data', () => {
  beforeEach(async () => !mongoose.connection.readyState && mockDatabase());
  afterEach(async () => clearDatabase());

  describe('getSmallestValidDeposit', () => {
    test('transaction has lower amount and valid confirmations, but incorrect category', async () => {
      const smallestValidDeposit = generateTransaction({
        category: 'receive',
        amount: 5,
        confirmations: 10,
      });
      const transactions = [
        generateTransaction({
          category: 'receive',
          amount: 100,
          confirmations: 10,
        }),
        generateTransaction({
          category: 'send',
          amount: 0,
          confirmations: 10,
        }),
        smallestValidDeposit,
      ];

      await seed(transactions, []);
      const smallestDeposit = await getSmallestValidDeposit();
      expect(smallestDeposit).toEqual(
        expect.objectContaining(smallestValidDeposit)
      );
    });
    test('transaction has lower amount and correct category, but invalid confirmations', async () => {
      const smallestValidDeposit = generateTransaction({
        category: 'receive',
        amount: 5,
        confirmations: 10,
      });
      const transactions = [
        generateTransaction({
          category: 'receive',
          amount: 10,
          confirmations: 10,
        }),
        generateTransaction({
          category: 'receive',
          amount: 1,
          confirmations: 2,
        }),
        smallestValidDeposit,
      ];

      await seed(transactions, []);
      const smallestDeposit = await getSmallestValidDeposit();
      expect(smallestDeposit).toEqual(
        expect.objectContaining(smallestValidDeposit)
      );
    });
  });

  describe('getLargestDeposit', () => {
    test('transaction has larger amount and valid confirmations, but incorrect category', async () => {
      await connect();
      const largestValidDeposit = generateTransaction({
        category: 'receive',
        amount: 50,
        confirmations: 10,
      });
      const transactions = [
        generateTransaction({
          category: 'receive',
          amount: 45,
          confirmations: 10,
        }),
        generateTransaction({
          category: 'send',
          amount: 100,
          confirmations: 10,
        }),
        largestValidDeposit,
      ];

      await seed(transactions, []);
      const largestDeposit = await getLargestValidDeposit();
      expect(largestDeposit).toEqual(
        expect.objectContaining(largestValidDeposit)
      );
    });

    test('transaction has larger amount and correct category, but invalid confirmations', async () => {
      await connect();
      const largestValidDeposit = generateTransaction({
        category: 'receive',
        amount: 50,
        confirmations: 10,
      });
      const transactions = [
        generateTransaction({
          category: 'receive',
          amount: 10,
          confirmations: 10,
        }),
        generateTransaction({
          category: 'receive',
          amount: 75,
          confirmations: 2,
        }),
        largestValidDeposit,
      ];

      await seed(transactions, []);
      const largestDeposit = await getLargestValidDeposit();
      expect(largestDeposit).toEqual(
        expect.objectContaining(largestValidDeposit)
      );
    });
  });

  describe('getAccountDeposits', () => {
    test('returns correct data', async () => {
      const customers = [
        {
          name: 'a',
          address: 'aaa',
        },
        {
          name: 'b',
          address: 'bbb',
        },
      ];

      const transactionsA = [
        generateTransaction({
          category: 'receive',
          amount: 10.2,
          confirmations: 10,
          address: 'aaa',
        }),
        generateTransaction({
          category: 'receive',
          amount: 10,
          confirmations: 10,
          address: 'aaa',
        }),
        generateTransaction({
          category: 'receive',
          amount: 5,
          confirmations: 1,
          address: 'aaa',
        }),
        generateTransaction({
          category: 'send',
          amount: 100,
          confirmations: 10,
          address: 'aaa',
        }),
      ];
      const transactionsB = [
        generateTransaction({
          category: 'receive',
          amount: 100.2,
          confirmations: 10,
          address: 'bbb',
        }),
        generateTransaction({
          category: 'receive',
          amount: 10,
          confirmations: 10,
          address: 'bbb',
        }),
        generateTransaction({
          category: 'receive',
          amount: 5,
          confirmations: 1,
          address: 'bbb',
        }),
        generateTransaction({
          category: 'send',
          amount: 100,
          confirmations: 10,
          address: 'bbb',
        }),
      ];

      const transactionsUnknown = [
        generateTransaction({
          category: 'receive',
          amount: 10.1,
          confirmations: 10,
          address: '123',
        }),
        generateTransaction({
          category: 'receive',
          amount: 50,
          confirmations: 10,
          address: '234',
        }),
        generateTransaction({
          category: 'receive',
          amount: 500,
          confirmations: 1,
          address: '345',
        }),
        generateTransaction({
          category: 'send',
          amount: 1000,
          confirmations: 10,
          address: '345',
        }),
        generateTransaction({
          category: 'send',
          amount: 123,
          confirmations: 3,
          address: '123',
        }),
      ];

      await seed(
        [...transactionsA, ...transactionsB, ...transactionsUnknown],
        customers
      );

      const data = await getAccountDeposits();

      const expectedResponse = {
        unknown: [{ _id: null, count: 2, sum: 60.1 }],
        customers: expect.arrayContaining([
          {
            _id: 'aaa',
            count: 2,
            sum: 20.2,
            customer: expect.objectContaining(customers[0]),
          },
          {
            _id: 'bbb',
            count: 2,
            sum: 110.2,
            customer: expect.objectContaining(customers[1]),
          },
        ]),
      };

      expect(data).toEqual(expectedResponse);
    });
  });
});
