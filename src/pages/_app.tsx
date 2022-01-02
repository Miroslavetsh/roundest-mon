import type { AppProps } from 'next/app'
import { withTRPC } from '@trpc/next'
import type { AppRouter } from '@/backend/router'

import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

const getBaseURL = () => {
  if (process.browser) return ''
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}/api/trpc`

  return `http://localhost:${process.env.PORT ?? 3000}/api/trpc`
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */
    const url = `${getBaseURL()}/api/trpc`

    return {
      url,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    }
  },
  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: false,
})(MyApp)
