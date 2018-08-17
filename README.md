# travis-env [![NpmVersion](https://img.shields.io/npm/v/travis-env.svg)](https://www.npmjs.com/package/travis-env)

A tool to manage a shared set of travis environment variables between github repos.

## Motivation

Travis doesn't support organization wide configurations for environment variables. As a result a simple tool is needed to minimize the per-repo configuration necessary.

More discussion [in this issue](https://github.com/travis-ci/travis-ci/issues/2069).

## Structure

There are 2 main components to this system.

### `.travis-env-ci.json`

A JSON file storing a key value map of environment variables to be stored in memory. This file is stored in an AWS S3 bucket and accessed via the AWS CLI and SDK. An example looks like the following:

```json
{
  "DOCKER_USERNAME": "username",
  "DOCKER_PASSWORD": "password",
  "OTHER_VARIABLE": "value"
}
```

### `T_ENV_CONFIG`

This is an environment variable set on each travis repo. This variable should be a JSON string of key/value pairs to be read into memory initially.

The strategy is store AWS credentials here along with the bucket name containing the `.travis-env-ci.json` file. This is just enough information to facilitate download, but can be easily invalidated in the event of a data breach.

An example config might look like the following:

```json
{
  "AWS_ACCESS_KEY_ID": "XXXXXXXXXXXXX",
  "AWS_SECRET_ACCESS_KEY": "XXXXXXXXXXXXXXX",
  "T_ENV_BUCKET": "YOUR_BUCKET_NAME"
}
```

Make sure that when it's supplied as an environment variable it's normalized for the shell:

```sh
'{"AWS_ACCESS_KEY_ID": "XXXXXXXXXXXXX","AWS_SECRET_ACCESS_KEY": "XXXXXXXXXXXXXXX","T_ENV_BUCKET":"YOUR_BUCKET_NAME"}'
```

## Use

### CI Environment

In a CI environment the `travis-env` executable will do the following:

- Look for an env variable called `T_ENV_CONFIG`
- Parse `T_ENV_CONFIG` and apply it to the current process
- Look for an env variable called `T_ENV_BUCKET`
- Download `.travis-env-ci.json` from `T_ENV_BUCKET`
- Parse the JSON file downloaded and output a list of env vars to stdout formatted as the following
- `T_ENV_CONFIG` variables will also be output

```sh
DOCKER_USERNAME=username
DOCKER_PASSWORD=password
OTHER_VARIABLE=value
AWS_ACCESS_KEY_ID=XXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=XXXXXXXXXXXXXXX
T_ENV_BUCKET=YOUR_BUCKET_NAME
```

This can be used to set environment variables in the shell like so:

```sh
npm i -g travis-env && eval "$(travis-env)"
```

### Non-CI Environment

In a non-ci environemnt the `travis-env` executable will ask for a bucket name and generate an empty `.travis-env-ci.json` file and put it in the root of the bucket. The config is stored in your home directory.

#### TODO

Make editing the `.travis-env-ci.json` easier, expand cli functionality.

## License

MIT
