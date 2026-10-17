# Hive Metastore to Unity Catalog Migration: Best Practices

A phased, step-by-step guide for migrating from the Hive metastore (HMS) to Databricks Unity Catalog, published as a static HTML site.

Open `index.html` locally, or serve the repo root with any web server.

## Phases

| # | Step | Focus |
|---|------|-------|
| 00 | Choose your path | Federation vs. direct migration vs. UCX, interactive method chooser, downtime position, roles, migration controls |
| 01 | Assess the estate | UCX assessment, inventory, system-table de-scoping |
| 02 | Design the UC target | Catalog/schema mapping, ownership |
| 03 | Identity and storage | Account groups, credentials, external locations, mounts to volumes |
| 04 | Migrate tables and views | SYNC, CONVERT TO DELTA, DEEP CLONE, SET MANAGED, views |
| 05 | Migrate permissions | Hive ACLs to UC grants, access parity |
| 06 | Compute, jobs and code | Access modes, DBR minimums, init scripts, libraries |
| 07 | Validate and run in parallel | Reconciliation checks |
| 08 | Cutover and decommission | Fallback mode, default catalog, per-wave cutover and go/no-go, rollback, disabling HMS (30-day point of no return), finalisation |
| + | Tracker, risks and first wave | Tracker template, risk register, first-wave guidance |

## Features

- Sticky navigation with scroll-spy, filter box, reading progress bar
- Light/dark theme, print stylesheet
- Copy buttons on every code block
- Persistent master checklist (browser local storage)
- Table-method chooser

## Hosting

- **GitHub Pages:** Settings, Pages, deploy from the default branch root. `.nojekyll` is included.
- **Apache httpd:** `.htaccess` enables compression, caching and security headers (needs `mod_deflate`, `mod_expires`, `mod_headers`).

## Status

Draft. Content is based on Databricks public documentation and blog posts. `SET MANAGED` is a Public Preview feature (DBR 17.3 LTS+). The "Not yet covered" list in the Sources section names the details that still need confirmation against current docs.

## License

Apache License 2.0. See [LICENSE](LICENSE).
