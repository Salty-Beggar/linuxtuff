FROM debian:latest
RUN apt-get update
RUN apt install -y npm
WORKDIR /srv
COPY . .
CMD npx vite --host && tail -f /dev/null