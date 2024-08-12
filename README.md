# Vue3/NUXT3 Framework for the NEXGEN UI

This project requires a specific version level of NodeJs.

The easiest way to control NodeJs versions is by installing the Node Version Manager

Install docs from three different sites:

- <https://www.linode.com/docs/guides/how-to-install-use-node-version-manager-nvm/>
- <https://www.geeksforgeeks.org/how-to-install-nvm-on-ubuntu-22-04/>
- <https://monovm.com/blog/install-nvm-on-ubuntu/>

Once you have installed NVM, you need to install the correct NodeJs version:

nvm install 12.20.13.1
nvm use 12.20.13.1

Then you can proceed....

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install
```

## Development Server

If using `ngencerf-server`, set environment variable `NGENCERF_BASE_URL` to the Ngencerf server base URL you're using:

```bash
export NGENCERF_BASE_URL=http://exampleurl
```

Note it uses `http://localhost:8000`, which is the default local URL used by Ngencerf server, by default if `NGENCERF_BASE_URL` is not set

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build
```

## Preview Locally

Locally preview production build:

```bash
# npm
npm run preview
```

## bun

```bash
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
