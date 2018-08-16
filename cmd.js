#!/usr/bin/env node

/**
 * A command line utility to provision github repos with a shared set of
 * travis environment variables. Persistent storage assumed to be S3.
 *
 **/

const [
  NODE_PATH,
  TRAVIS_ENV_PATH,
  COMMAND
] = process.argv

const commands = [
  'add'
];

if (COMMAND === 'add') {

}
