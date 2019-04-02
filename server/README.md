# Solution to Level 1

Used technologies:
- [NodeJS](https://nodejs.org/).
- [ExpressJS](https://expressjs.com/) - web framework.
- [Jest](https://jestjs.io/) - testing framework.
- [axios](https://github.com/axios/axios) - HTTP client used in acceptance testing.

The source code is located in `src/` directory. `api-test/` directory includes
the acceptance tests.

### Run the server

```sh
npm install
npm run start
```

### Build

No build step is required.

### Test

To run all tests (unit and acceptance):

```sh
npm run test
```

To run unit tests only:

```sh
npm run test:unit
```

To run acceptance tests only:

```sh
npm run test:acceptance
```
