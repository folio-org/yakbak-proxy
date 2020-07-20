# Change history for yakbak-proxy

## [1.5.0](https://github.com/folio-org/yakbak-proxy/tree/v1.5.0) (IN PROGRESS)
[Full Changelog](https://github.com/folio-org/yakbak-proxy/compare/v1.4.0...v1.5.0)

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

