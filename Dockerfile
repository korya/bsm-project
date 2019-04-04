FROM nginx:1.15.10-alpine

COPY server /opt/bsm/server
RUN apk add --no-cache nodejs nodejs-npm && \
    cd /opt/bsm/server && npm install

COPY client/build /opt/bsm/client
COPY nginx/*.conf /etc/nginx/conf.d/
COPY docker/entrypoint.sh /opt/bsm/

EXPOSE 80/tcp 8080/tcp

CMD ["/opt/bsm/entrypoint.sh"]
