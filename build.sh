#!/bin/sh

set -ex

npm install
npm run test
npm run build
docker build -t sudoku-ws:level-4 .
