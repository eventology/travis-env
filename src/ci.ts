
import * as AWS from 'aws-sdk';
import { CI_CONFIG_KEY } from './constants';
import Bluebird from 'bluebird';
const S3: any = Bluebird.promisifyAll(new AWS.S3());

// Assume our credentials are good

export default class CI {
  static async loadEnvVars() {
    // Assert existence of bucket
    if (!process.env.T_ENV_BUCKET) {
      console.error('No T_ENV_BUCKET specified in ENV');
      process.exit(1);
    }
    const config = await S3.getObjectAsync({
      Bucket: process.env.T_ENV_BUCKET,
      Key: CI_CONFIG_KEY || process.env.CI_CONFIG_KEY
    });
    const output = '';
    Object.keys(config).forEach((value, key) => {
      output.concat(`\n${value}=${key}`);
    });
    process.stdout.write(output);
    process.exit(0);
  }

  static async createEmptyConfig(bucket: string) {
    await S3.putObjectAsync({
      Bucket: bucket,
      Key: CI_CONFIG_KEY,
      Body: '{}'
    });
  }
}
