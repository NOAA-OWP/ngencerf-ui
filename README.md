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

## Development

If using `ngencerf-server`, set environment variable `NGENCERF_BASE_URL` to the Ngencerf server base URL you're using:

```bash
export NGENCERF_BASE_URL=http://exampleurl
```

Note `http://localhost:8000` is used by default if `NGENCERF_BASE_URL` is not set

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev
```

### Adding Authenticated API Calls to ngencerf-server

If you need to make authenticated API calls to `ngencerf-server`, use the `makeProtectedApiCall` function from `~/utils/UserAuth.ts`. This function will automatically refresh the access token if it has expired. Access tokens expire every 15 minutes and refresh tokens expire every hour. When the refresh token expires, the user will be redirected to the login page and will need to log in again.

Here is an example of how to use `makeProtectedApiCall`:

```typescript
import { makeProtectedApiCall } from "~/utils/UserAuth";
import { useUserDataStore } from "@/stores/common/UserDataStore";

const userDataStore = useUserDataStore();

const protectedApiCallOutput: string | null = await makeProtectedApiCall(
  `${ngencerfBaseUrl}/calibration/get_footer/`,
  {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${userDataStore.getAccessToken()}`
    }
  }
);
console.log("protectedApiCallOutput:", protectedApiCallOutput);
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
