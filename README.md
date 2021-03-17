# NodeJS Google Drive Proxy

Simple tool for proxying /videoplayback videos from Google Drive

## Installation

Clone this repository

```bash
git clone https://github.com/minhpg/nodejs-google-drive-proxy
```

Change the configurations in the .env file
```
USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36
COOKIE=
SECRET=
VIRTUAL_HOST=
BUGSNAP_API=
PROXY_LIST=proxy.json
NODE_ENV=production
```

Install Docker Compose

## Usage

Run Docker Container
```
docker-compose up
```
