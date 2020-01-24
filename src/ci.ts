import * as AWS from 'aws-sdk';
import { CI_CONFIG_KEY } from './constants';
const S3: any = new AWS.S3();

// Assume our credentials are good

export default class CI {
  static async loadEnvVars(additionalVars: any = {}) {
    // Assert existence of bucket
    if (!process.env.T_ENV_BUCKET) {
      console.error('No T_ENV_BUCKET specified in ENV');
      process.exit(1);
    }
    const response = await S3.getObject({
      Bucket: process.env.T_ENV_BUCKET,
      Key: CI_CONFIG_KEY
    }).promise();
    const config = {
      ...additionalVars,
      ...JSON.parse(response.Body.toString())
    };
    let output = '';
    Object.keys(config).forEach(key => {
      const value = config[key];
      output = output.concat(`\nexport ${key}=${value}`);
    });
    process.stdout.write(output);
    process.exit(0);
  }

  static async createEmptyConfig(bucket: string) {
    await S3.putObject({
      Bucket: bucket,
      Key: CI_CONFIG_KEY,
      Body: '{}'
    }).promise();
  }
}
