# Vue3/NUXT3 Framework for the ngencerf UI

This project requires a specific version level of Node.js.

The easiest way to control Node.js versions is by installing the Node Version Manager (nvm). Folow the instructions [here](https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating) to install nvm.

Once you have installed nvm, you need to install the correct Node.js version:

```bash
nvm install 20.15.0
nvm use 20.15.0
```

Then you can proceed....

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
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
./runUi.sh
```

### Adding Authenticated API Calls to ngencerf-server

If you need to make authenticated API calls to `ngencerf-server`, use the `makeProtectedApiCall` function from `/composables/UserAuth.ts`. This function will automatically refresh the access token if it has expired. Access tokens expire every 15 minutes and refresh tokens expire every hour. When the refresh token expires, the user will be redirected to the login page and will need to log in again.

Here is an example of how to use `makeProtectedApiCall`:

```typescript
import { makeProtectedApiCall } from "@/composables/UserAuth";
import { useBackendConfig } from "@/composables/UseBackendConfig";
import { useUserDataStore } from "@/stores/common/UserDataStore";

const { ngencerfBaseUrl } = useBackendConfig();

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
npm run build
```

## Preview Locally

Locally preview production build:

```bash
npm run preview
```

## bun

```bash
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
