import { connect } from './services/db';
import { start } from './app/index';

(async function () {
  await connect();
  await start();
})();
