# yakbak-proxy

Copyright (C) 2020 The Open Library Foundation

This software is distributed under the terms of the Apache License, Version 2.0. See the file "[LICENSE](LICENSE)" for more information.

## Introduction

`yakbak-proxy` is a simple Web proxy implemented using [`yakbak`](https://github.com/flickr/yakbak). It accepts incoming HTTP connections and proxies them through the nominated server, keeping a record ("tapes") of all requests and their corresponding responses. Then later you can run the same client against the same proxy server, and it will re-use the tapes. This is especially useful for testing a Web UI away from its corresponding back-end.

This code was derived from [the five-line sample proxy-server in the YakBak docs](https://github.com/flickr/yakbak#with-nodes-http-module).

## Usage

	yakbak-proxy [options] <serverUrl>

The `serverUrl` _must_ be specified, and is the full URL of the HTTP or HTTPS service to be proxied. The following options are recognised:

* `-v` or `--verbose` -- Log parameters before starting server [default: false]. This is not in fact very verbose, but does at least serve to let you know that `yakbak-proxy` has started up.
* `-n` or `--norecord` -- Fail requests for which no tape has been stored by an earlier run [default: false]. In this mode, `yakbak-proxy` will never visit the server it is proxying for, but will _only_ serve up previously taped responses.
* `-i` or `--ignoreheaders` -- Exclude request headers from the hash function [default: false]. The response corresponding to any given request is looked up by means of a hashcode derived from the request, including the HTTP version, method, URL path and query, headers and trailers. In some situations, this is too precise, because you may need to submit the "same" request with different headers. When `--ignoreheaders` is specified, the headers are not included in the request hash, so that a taped response will be returned provided the other parts of the request match irrespective of what the headers are.
* `-p` _num_ or `--port` _num_ -- Listen on the specified port number [default: 3002].
* `-t` _dir_ or `--tapes` _dir_ -- Store the tapes in the specified directory [default: `tapes`].

For example

	yakbak-proxy.js -v -i -t yakbak/tapes https://folio-snapshot-okapi.aws.indexdata.com

This runs in verbose mode, ignoring headers for the purposes of distinguishing requests, storing tapes in and reading tapes from `yakbak/tapes` and proxying the FOLIO Snapshot OKAPI web-service. The proxy listens on the default port 3002.

