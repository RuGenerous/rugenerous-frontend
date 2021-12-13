FROM node:14 as builder

RUN mkdir -p /usr/local/bin \
	&& ln -svf /app/.docker/entrypoint.sh /usr/local/bin/entrypoint

WORKDIR app

ENTRYPOINT ["entrypoint"]




