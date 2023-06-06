<p align="center" id="imkey">
  <a href="https://imkey.org.id" target="blank">
    <img src="./Logo.png" width="200" alt="IMKEY Logo" />
  </a>
  <h1 align="center" style="font-weight: bold;">Ikatan Mahasiswa Kendal <p style="font-size: 20px; font-weight: normal;">Yogyakarta</p></h1>
</p>

[![Project Version](https://img.shields.io/github/package-json/v/imkey-org/imkey?style=flat-square)](https://github.com/imkey-org/imkey/releases)
[![Project License](https://img.shields.io/github/license/imkey-org/imkey?style=flat-square)](https://github.com/imkey-org/imkey/blob/main/LICENSE)

## [Go to App](https://imkey.or.id)

<p>
  This website is a management information system for regional student organizations, namely the "Kendal Yogyakarta Student Association (IMKEY)". This is expected to help or be a solution for more modern, efficient and effective management.
</p>

## Table of Contents
- [Go to App](#go-to-app)
- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Installation](#installation)
  - [Running the app](#running-the-app)
  - [Running db sync schemas](#running-db-sync-schemas)
  - [Test](#test)
- [Infrastructure](#infrastructure)
- [Contributors Wall](#contributors-wall)
- [License](#license)

## Features
- [x] Authentication
- [ ] Authorization
- [ ] User Management
- [ ] Member Management
- [ ] Event Management
- [ ] Articles Management
- [ ] Gallery Management
- [ ] Linkhub Management
- [ ] Shortlink Management
- [ ] Structure Organization Management
- [ ] Department Management
- [ ] Period Management
- [ ] Work Program Management

## Installation

```bash
$ git clone https://github.com/imkey-org/imkey
$ cd imkey
$ yarn install
```

### Running the app

```bash
# development
$ yarn run dev

# build
$ yarn run build

# production mode
$ yarn run start
```

### Running db sync schemas

```bash
# generate schema
$ yarn run postinstall

# run db push
$ yarn run db:push
```

### Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Infrastructure

- [Next.js](https://nextjs.org/), Fullstack framework
- [tRPC](https://trpc.io/), RPC framework
- [TypeScript](https://www.typescriptlang.org/), programming language
- [Prisma](https://prisma.io/), ORM
- [Tailwind CSS](https://tailwindcss.com/), CSS framework
- [MongoDB](https://mongodb.com/), Database
- [NextAuth.js](https://next-auth.js.org/), Authentication
- [Vercel](https://vercel.com/), Infrastructure provider

&nbsp;

<a href="https://vercel.com?utm_source=imkey-org&utm_campaign=oss">
  <img src="https://images.ctfassets.net/e5382hct74si/78Olo8EZRdUlcDUFQvnzG7/fa4cdb6dc04c40fceac194134788a0e2/1618983297-powered-by-vercel.svg" width="200px" />
</a>

## Contributors

<a href="https://github.com/imkey-org/imkey/graphs/contributors">

  <img src="https://contrib.rocks/image?repo=imkey-org/imkey" />

</a>



_Note: It may take up to 24h for the [contrib.rocks](https://contrib.rocks/image?repo=imkey-org/imkey) plugin to update because it's refreshed once a day._





## License

IMKEY is packaged and distributed using the [MIT License](https://choosealicense.com/licenses/mit/) which allows for commercial use, distribution, modification and private use provided that all copies of the software contain the same license and copyright.

_By the community, for the community._
