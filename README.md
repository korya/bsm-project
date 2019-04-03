# Solution to Sudoku Project

This is a solution to BSM take-home Sudoku project. The directory layout is as
follows:
- `server/` contains the back-end side of the solution, Level 1+3.
- `client/` contains the front-end side of the solution, Level 2+3.

## Available Scripts

In the project directory, you can run:

### Run locally

```sh
npm start
```

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

**NOTE**: The command will use webpack-dev-server as an HTTP reverse proxy
serving both the back-end and the front-end. This contradicts the explicit
requirement of Level 2 to use nginx as a reverse proxy. But I think it is OK,
since this command is used to run the app in dev environment.
The build command below, `npm run build`, builds and bundles the application
as required by the spec.

### Build

```sh
npm run build
```

Builds the app for production.

### Test 

```sh
npm test
```

Runs all the tests. <br>
