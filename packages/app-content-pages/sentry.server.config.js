import * as Sentry from '@sentry/nextjs'

const dsn = process.env.SENTRY_CONTENT_DSN
const release = process.env.COMMIT_ID
const environment = process.env.APP_ENV

Sentry.init({
  dsn,
  environment,
  integrations: [...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations()],
  release,
  tracesSampleRate: 1.0
})

console.log('Initialising Sentry:', dsn, environment, release)