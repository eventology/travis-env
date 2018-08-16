#!/usr/bin/env node

/**
 * A command line utility to provision github repos with a shared set of
 * travis environment variables. Persistent storage assumed to be S3.
 *
 **/

import * as path from 'path';
import * as fs from 'fs';
import * as AWS from 'aws-sdk';
const S3 = new AWS.S3();

if (!AWS.config.credentials.accessKeyId) {
  console.error('No aws credentials have been detected');
  process.exit(1);
}

if (!process.env.HOME) {
  console.error('No HOME env variable found, can\'t calculate config path');
  process.exit(1);
}

const CONFIG_PATH = `${path.join(process.env.HOME, '.travis-env.json')}`;

if (fs.existsSync(CONFIG_PATH)) {
  console.log('Loading config');
} else {
  console.error('No config file detected, exiting');
  process.exit(0);
}

require('yargs')
  .command(
    'config',
    'Configure your travis-env settings',
    (yargs: any): void => {},
    (argv: any) => {
      // Run command
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
