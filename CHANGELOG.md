# Change history for yakbak-proxy

## [1.7.0](https://github.com/folio-org/yakbak-proxy/tree/v1.7.0) (2021-09-29)
[Full Changelog](https://github.com/folio-org/yakbak-proxy/compare/v1.6.0...v1.7.0)

* Add new `requestfull` logging category, like `request` except that it does not trucate the tape name. This is useful when you need to know the name of a tape that's missing so you can create it manually.

## [1.6.0](https://github.com/folio-org/yakbak-proxy/tree/v1.6.0) (2021-02-12)
[Full Changelog](https://github.com/folio-org/yakbak-proxy/compare/v1.5.0...v1.6.0)

* Specify a default `trailers` entry in request. This avoids an error in `incoming-message-hash` when no trailers are defined. Thanks to @doytch.

## [1.5.0](https://github.com/folio-org/yakbak-proxy/tree/v1.5.0) (2020-07-20)
[Full Changelog](https://github.com/folio-org/yakbak-proxy/compare/v1.4.0...v1.5.0)

* Smarter assignment of sequence numbers to repeated operations, now incrementing only after a write operation (i.e., a POST, PUT or DELETE that is not to a `login` URL). This reduces the number of tapes needed or a typical test-suite by about half.
* Remove `--sequence` option, which is now effectively always true: the new smarter sequencing algorithm generates the same tapes as would be generated in non-`--sequence` mode when there are no POST, PUT or DELETEs, and that is the only circumstance under which things would work right without that mode anyway.
* Add support for `yarn lint`, and lint-tidy the script.

## [1.4.0](https://github.com/folio-org/yakbak-proxy/tree/v1.4.0) (2020-07-17)
[Full Changelog](https://github.com/folio-org/yakbak-proxy/compare/v1.3.0...v1.4.0)

* Remove `--verbose` (`-v`) command-line option in favour of `LOGCAT`.
* Logging is now done via [categorical-logger](https://github.com/openlibraryenvironment/categorical-logger), configured via the `LOGGING_CATEGORIES` or `LOGCAT` environment variable.
* Update top-level [README](README.md), including information about logging.

## [1.3.0](https://github.com/folio-org/yakbak-proxy/tree/v1.3.0) (2020-07-17)
[Full Changelog](https://github.com/folio-org/yakbak-proxy/compare/v1.2.0...v1.3.0)

* Add `--exciseid` (`-x`) command-line option. When enabled, hash signatures for POST requests use a body from which any `id` field has been excised, removing some effects of randomness that defeat hash-matching.
* Tidy up logging slightly.

## [1.2.0](https://github.com/folio-org/yakbak-proxy/tree/v1.2.0) (2020-07-15)
[Full Changelog](https://github.com/folio-org/yakbak-proxy/compare/v1.1.0...v1.2.0)

* Add `--sequence` (`-q`) command-line option. When enabled, hash signatures contain a sequence number so that repeated identical requests do not get served the same response. Can be necessary when running tests that write as well as reading.
* When running in `--norecord` mode, no server-address is necessary or allowed.

## [1.1.0](https://github.com/folio-org/yakbak-proxy/tree/v1.1.0) (2020-07-03)
[Full Changelog](https://github.com/folio-org/yakbak-proxy/compare/v1.0.0...v1.1.0)

* Documentation in the [`README.md`](README.md).
* Add a [LICENSE](LICENSE) file.

## [1.0.0](https://github.com/folio-org/yakbak-proxy/tree/v1.0.0) (2020-07-03)

* First release.

