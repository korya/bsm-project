#!/bin/sh

node /opt/bsm/server/src/index.js &

nginx 

tail -f /var/log/nginx/*.log
