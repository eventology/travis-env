import * as fs from 'fs';
import { CONFIG_PATH } from './constants';

export default class Local {
  static async writeConfig(bucket: string) {
    await new Promise((rs, rj) => {
      fs.writeFile(
        CONFIG_PATH,
        JSON.stringify({
          bucket,
          version: 1
        }),
        err => (err ? rj(err) : rs())
      );
    });
  }
}
