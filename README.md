# travis-env [![NpmVersion](https://img.shields.io/npm/v/travis-env.svg)](https://www.npmjs.com/package/travis-env)

A tool to manage a shared set of travis environment variables between github repos.

## Motivation

Travis doesn't support organization wide configurations for environment variables. As a result a simple tool is needed to minimize the per-repo configuration necessary.

More discussion [in this issue](https://github.com/travis-ci/travis-ci/issues/2069).

## Use

CLI is simple right now, run in an authenticate aws environment.

Put a file named `.travis-env-ci.json` in an S3 bucket and then run the following command in a CI environment:

```
npm i -g travis-env && eval "$(travis-env)"
```

This will install and run the `travis-env` package and read the output into local environment variables. `travis-env` will look for a local variable called `T_ENV_CONFIG` and parse the value as a JSON string and assign it onto the local env. Use this to pass multiple config flags at once.

Travis repo config should have a secret structured like the following:

```json
{
  "AWS_ACCESS_KEY_ID": "XXXXXXXXXXXXX",
  "AWS_SECRET_ACCESS_KEY": "XXXXXXXXXXXXXXX",
  "T_ENV_BUCKET": "YOUR_BUCKET_NAME"
}
```

The config above can be passed to authenticate with AWS and supply a bucket name. A file named `.travis-env-ci.json` will be downloaded, parsed, and output to `stdout` formatted in such a way that the shell can read it (via `eval` or `source`).

Make sure that when it's supplied as an environment variable it's normalized for shell input.

```sh
T_ENV_CONFIG='{"AWS_ACCESS_KEY_ID": "XXXXXXXXXXXXX","AWS_SECRET_ACCESS_KEY": "XXXXXXXXXXXXXXX","T_ENV_BUCKET":"YOUR_BUCKET_NAME"}'
```

## License

MIT
