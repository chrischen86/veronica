export default () => ({
  database: {
    region: process.env.DATABASE_REGION || 'us-east-1',
    endpoint: process.env.DATABASE_ENDPOINT,
  },
  auth: {
    issuerUrl: process.env.AUTH0_ISSUER_URL || '',
    audience: process.env.AUTH0_AUDIENCE || '',
  },
});
