import { connect } from '../services/db';

export default async function globalSetup() {
  await connect();
}
