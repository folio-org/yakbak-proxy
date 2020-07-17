#!/usr/bin/env node

/* eslint-disable no-console */

const path = require('path');
const commandLineArgs = require('command-line-args');
const http = require('http');
const yakbak = require('yakbak');
const hash = require('incoming-message-hash');

const optionDefinitions = [
  { name: 'verbose', alias: 'v', type: Boolean, defaultValue: false },
  { name: 'norecord', alias: 'n', type: Boolean, defaultValue: false },
  { name: 'ignoreheaders', alias: 'i', type: Boolean, defaultValue: false },
  { name: 'exciseid', alias: 'x', type: Boolean, defaultValue: false },
  { name: 'sequence', alias: 'q', type: Boolean, defaultValue: false },
  { name: 'port', alias: 'p', type: Number, defaultValue: 3002 },
  { name: 'tapes', alias: 't', type: String, defaultValue: 'tapes' },
  { name: 'server', alias: 's', type: String, defaultOption: true },
];

let options;
try {
  options = commandLineArgs(optionDefinitions);
} catch (e) {
  console.error(
    `Could not parse command line: ${e}
Usage: ${process.argv[1]} [options] <serverUrl>
        -v|--verbose            Log parameters before starting server
        -n|--norecord           Fail requests that have no tape [default: false]
        -i|--ignoreheaders      Exclude headers from hash function [default: false]
        -x|--exciseid           Excise 'id' fields from POST requests [default: false]
        -q|--sequence           Include sequence numbers in each request [default: false]
        -p|--port <num>         Listen on port <num> [default: 3002]
        -t|--tapes <dir>        Write tapes to <dir> [default: tapes]`
  );
  process.exit(1);
}

if (!options.norecord && !options.server) {
  console.error(`${process.argv[1]}: no server address supplied`);
  process.exit(2);
}

if (options.norecord && options.server) {
  console.error(`${process.argv[1]}: unnecessary server address supplied`);
  process.exit(2);
}

if (options.verbose) {
  console.log(`listening on port ${options.port},`,
              options.norecord ? 'not proxying' : `proxying to ${options.server}`);
}

let counters = {};
http.createServer(yakbak(options.server, {
  // Yakbak can't find its own tapes if this is not an absolute path
  dirname: path.resolve(options.tapes),
  noRecord: options.norecord,
  hash: (req, body) => {
    const extras = {};
    if (options.ignoreheaders) extras.headers = {};
    if (req.method === 'POST' && options.exciseid) {
      const s = body.toString();
      const j = JSON.parse(s);
      delete j.id;
      const s2 = JSON.stringify(j);
      body = Buffer.from(s2);
    }

    const digest = hash.sync({ ...req, ...extras }, body);
    if (!options.sequence) return digest;

    const counter = counters[digest] || 0;
    console.log(' '.repeat(counter), counter, digest.substring(0, 8), req.method, req.url);
    counters[digest] = counter+1;
    return digest + '-' + counter;
  },
})).listen(options.port);
