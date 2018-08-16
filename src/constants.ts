
import * as path from 'path';

export const CI_CONFIG_KEY = '.travis-env-ci.json';

if (!process.env.HOME) {
  console.error('No HOME env variable found, can\'t calculate config path');
  process.exit(1);
}
export const CONFIG_PATH = path.join(process.env.HOME, '.travis-env.json');
