import { initTsrReactQuery } from '@ts-rest/react-query/v5';
// import { getAccessToken } from '@some-auth-lib/sdk';
import { contract } from '@fish/contracts';

export const tsr = initTsrReactQuery(contract, {
  baseUrl:
    process.env.NEXT_PUBLIC_API_URL!,
  baseHeaders: {
    'x-app-source': 'ts-rest',
    authorization: () => {
      if (typeof window === "undefined") {
        return "";
      }

      const token =
        localStorage.getItem(
          "adminToken"
        );

      return token
        ? `Bearer ${token}`
        : "";
    },
    // 'x-access-token': () => getAccessToken(),
  },
});