# NodeJS Google Drive Proxy

Simple tool for proxying /videoplayback videos from Google Drive

## Installation

Clone this repository

```bash
git clone https://github.com/minhpg/nodejs-google-drive-proxy
```

Run install script
```
bash install.sh
```

Change the configurations in the .env file
```
PORT=80
USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36
COOKIE=
SECRET=
VIRTUAL_HOST=
BUGSNAP_API=
PROXY_LIST=proxy.json
NODE_ENV=production
```


## Usage
To start

```bash
bash start.sh
```

To restart

```bash
bash restart.sh
```
