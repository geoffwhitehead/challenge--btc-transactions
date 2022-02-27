import { Schema, model } from 'mongoose';

export interface Customer {
  name: string;
  address: string;
}

const schema = new Schema<Customer>({
  name: { type: String, required: true },
  address: { type: String, required: true, unique: true },
});

export const CustomerModel = model<Customer>('Customer', schema);
