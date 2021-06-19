export default () => ({
  database: {
    region: process.env.DATABASE_REGION || 'us-east-1',
    endpoint: process.env.DATABASE_ENDPOINT,
  },
});
