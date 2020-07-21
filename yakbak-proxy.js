#!/usr/bin/env node

/* eslint no-console: ["error", { allow: ["error"] }] */

const path = require('path');
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const Logger = require('categorical-logger');
const http = require('http');
const yakbak = require('yakbak');
const hash = require('incoming-message-hash');

const l = new Logger(process.env.LOGGING_CATEGORIES || process.env.LOGCAT);

const optionDefinitions = [
  { name: 'norecord', alias: 'n', type: Boolean, defaultValue: false, description: 'Fail requests that have no tape' },
  { name: 'ignoreheaders', alias: 'i', type: Boolean, defaultValue: false, description: 'Exclude headers from hash function' },
  { name: 'exciseid', alias: 'x', type: Boolean, defaultValue: false, description: 'Excise "id" fields from POST requests' },
  { name: 'port', alias: 'p', type: Number, defaultValue: 3002, description: 'Listen on port <num> [default: 3002]' },
  { name: 'tapes', alias: 't', type: String, defaultValue: 'tapes', description: 'Write tapes to <dir> [default: tapes]' },
  { name: 'server', alias: 's', type: String, defaultOption: true, description: 'Specify server to proxy for' },
];

let options;
try {
  options = commandLineArgs(optionDefinitions);
} catch (e) {
  console.error(`Could not parse command line: ${e}`);
  console.error(commandLineUsage({
    header: `Usage: ${process.argv[1].replace(/.*\//, '')} [options] <serverUrl>`,
    optionList: optionDefinitions,
  }));
  process.exit(1);
}

if (!options.norecord && !options.server) {
  console.error(`${process.argv[1]}: no server address supplied`);
  process.exit(2);
} else if (options.norecord && options.server) {
  console.error(`${process.argv[1]}: unnecessary server address supplied`);
  process.exit(2);
}

l.log('startup', `listening on port ${options.port},`,
  options.norecord ? 'not proxying' : `proxying to ${options.server}`);

const counters = {}; // maps digests to count of unique responses
let seenSinceWrite = {}; // maps digests to true if seen since last write

http.createServer(yakbak(options.server, {
  // Yakbak can't find its own tapes if this is not an absolute path
  dirname: path.resolve(options.tapes),
  noRecord: options.norecord,
  hash: (req, originalBody) => {
    const extras = {};
    if (options.ignoreheaders) extras.headers = {};
    let body = originalBody;
    if (req.method === 'POST' && options.exciseid) {
      const s = body.toString();
      const j = JSON.parse(s);
      delete j.id;
      const s2 = JSON.stringify(j);
      body = Buffer.from(s2);
    }

    const digest = hash.sync({ ...req, ...extras }, body);

    if ((req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE')
        && !(req.url.match(/\/login[/?]/))) {
      // Special case: no need to invalidate cache for a login
      seenSinceWrite = {};
    }

    let counter = counters[digest] || 0;
    if (!seenSinceWrite[digest]) {
      seenSinceWrite[digest] = true;
      counter += 1;
      counters[digest] = counter;
    }
    l.log('request', ' '.repeat(counter), counter, digest.substring(0, 8), req.method, req.url);
    return `${digest}-${counter}`;
  },
})).listen(options.port);
