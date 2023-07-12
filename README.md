<<<<<<< HEAD
<<<<<<< HEAD
# README #

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

* Quick summary
* Version
* [Learn Markdown](https://bitbucket.org/tutorials/markdowndemo)

### How do I get set up? ###

* Summary of set up
* Configuration
* Dependencies
* Database configuration
* How to run tests
* Deployment instructions

### Contribution guidelines ###

* Writing tests
* Code review
* Other guidelines

### Who do I talk to? ###

* Repo owner or admin
* Other community or team contact
=======
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
>>>>>>> 35b2bb4 (first)
=======
# TraCAD - Country Scheduler

Backend service for ICAT Climate Action Assessment Tool for Transport Sector - TraCAD. This application synchronize the Country database with the PMU database using CRON jobs.

Supported by [Initiative for Climate Action Transparency - ICAT](https://climateactiontransparency.org/).

Built using [Node.js 18](https://nodejs.org/dist/latest-v18.x/docs/api/) and [Nest](https://github.com/nestjs/nest) framework.

## Database Configuration

This application uses a [MySQL Database](https://www.mysql.com/). The `ICAT-country.sql` configuration file containing the database schema and some dummy data is provided in the CountryPortalService repository.

## Manual Installation

1. Download and install the [Node.js 18 LTS version](https://nodejs.org/en/download) for your operational system.

2. Download or clone this repository.

3. In the terminal, go to this repository's main folder.

4. Install the NPM dependencies (including Nest) with the command:

```bash
$ npm install --force
```

5. Set up the Environment Variables

   - **Windows:** using the `set` command in the terminal
   - **Linux/MacOS:** using the `export` command in the terminal

6. Run the app:

```bash
$ npm run start
```

## Google Cloud Installation with Docker

> This is an example cloud installation using [Docker](https://www.docker.com/) and Google Cloud Plataform. The provided `Dockerfile` can be used for local or cloud installation with different services.

1. In GCP Console, go to [Artifact Registry](https://console.cloud.google.com/artifacts) and enable the Artifact Registry API

2. In the Artifact Registry, create a new repository:

   - **Format:** Docker
   - **Type:** Standard
   - **Location:** desired application location
   - **Encryption:** Google-managed key

3. Download and install [gcloud CLI](https://cloud.google.com/sdk/docs/install).

4. Download or clone this repository.

5. In the terminal, go to this repository's main folder.

6. Build your container in the Artifacts Register using the provided `Dockerfile`. The container path can be found on the Artifact Registry's repository page.

```bash
$ gcloud builds submit --tag [CONTAINER PATH]
```

7. Go to [Cloud Run](https://console.cloud.google.com/run) and create a New Service:
   - Choose the option `Deploy one revision from an existing container image` and select the container image updated in the previous step
   - Add a service name
   - Select the application region
   - Select `Allow unauthenticated invocations` in the Authentication option
   - In the **Container section**:
     - Select Container port 8081
     - Add the Environment Variables
     - Add the Cloud SQL connections

> Noticed that some [special permissions in GCP](https://cloud.google.com/run/docs/reference/iam/roles#additional-configuration) can be necessary to perform these tasks.

## Environment Variables

The environment variables should be declared as follow:

| Variable name         | Description                |
| --------------------- | -------------------------- |
| `SOCKET_PATH`         | Database Socket Path       |
| `DATABASE_PORT`       | Database Port              |
| `DATABASE_USER`       | Database Socket User       |
| `DATABASE_PASSWORD`   | Database Password          |
| `DATABASE_NAME`       | Database Name              |
| `PMU_BASE_URL`        | PMU Portal Service API URL |
| `CAL_ENGINE_BASE_URL` | Calculation Engine API URL |

## Dependencies

This application consumes data from CalculationEngine and PMUPortalService applications APIs and update the database shared with the Country App.

The complete dependency diagram of TraCAD Country and PMU applications:

<p align="left">
  <img src="https://lucid.app/publicSegments/view/9a6fb822-be5a-47d7-ad67-0434a4025234/image.png" width="800" alt="TraCAD Diagram" /></a>
</p>

## License

TraCAD - CountryPortalService is [Affero GPL licensed](https://www.gnu.org/licenses/agpl-3.0.en.html).
>>>>>>> 566fb4beef6daf765be7acc969f7de3dbe7c8740
