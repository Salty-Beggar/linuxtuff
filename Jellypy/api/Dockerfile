FROM debian:latest
RUN apt-get update
RUN apt install -y python3 python3-flask python3-yaml yt-dlp curl
WORKDIR /srv
COPY . .
CMD flask --app index.py run --debug --host 0.0.0.0 && tail -f /dev/null