#!/usr/bin/env node

/**
 * A command line utility to provision github repos with a shared set of
 * travis environment variables. Persistent storage assumed to be S3.
 *
 **/

// Parse JSON from the env var T_ENV_CONFIG and assign onto shared process env
// Put any AWS config in that env var
if (process.env.T_ENV_CONFIG) {
  Object.assign(process.env, JSON.parse(process.env.T_ENV_CONFIG));
}

import * as fs from 'fs';
import * as readline from 'readline';
import * as AWS from 'aws-sdk';
import CI from './ci';
import Local from './local';
import Bluebird from 'bluebird';
import { CONFIG_PATH, CI_CONFIG_KEY } from './constants';

const S3: any = Bluebird.promisifyAll(new AWS.S3());

(async () => {

  if (!AWS.config.credentials.accessKeyId) {
    console.error('No aws credentials have been detected');
    process.exit(1);
  }

  if (process.env.CI) {
    // We are running in CI, simply output the env vars
    await CI.loadEnvVars();
    process.exit(0);
  }

  if (fs.existsSync(CONFIG_PATH)) {
    console.log('Loading config');
  } else {
    console.error('No config file detected...');
    createConfig();
  }

  require('yargs')
    .command(
      'config',
      'Configure your travis-env settings',
      (yargs: any): void => {},
      async (argv: any) => {
        // Run command
        await createConfig();
      }
    )
    .command(
      'add (repo)',
      'Add a repo to the auth list',
      (yargs: any) => {
        yargs.positional('repo', {
          describe: 'Repo to generate keys for',
        });
      },
      (argv: any) => {
        if (argv.verbose) console.info(`start server on :${argv.port}`);
        // Run command
      }
    )
    .option('verbose', {
      alias: 'v',
      default: false,
    }).argv;

  async function createConfig(): Promise<void> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    const question = Bluebird.promisify((question: string, callback: (err?: any, answer?: string) => void) => {
      rl.question(question, (_answer) => callback(null, _answer));
    });
    const bucket = await question('Enter your S3 bucket:\n');
    try {
      const object = await S3.getObjectAsync({
        Bucket: bucket,
        Key: CI_CONFIG_KEY
      });
      console.log('Bucket and key exist');
    } catch (err) {
      if (err.code === 'NoSuchKey') {
        // No key but the bucket exists
        await CI.createEmptyConfig(bucket);
        console.log('Created empty config file');
      } else if (err.code === 'NoSuchBucket') {
        console.error('Bucket not found');
        process.exit(1);
      } else {
        console.error('Unexpected S3 error', err);
        process.exit(1);
      }
    }
    await Local.writeConfig(bucket);
    console.log('Config written');
    process.exit(0);
  }
})();
