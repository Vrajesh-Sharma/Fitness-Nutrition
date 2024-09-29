const { google } = require('googleapis');
const { oauth2Client } = require('./auth');

const fitness = google.fitness({ version: 'v1', auth: oauth2Client });

async function getFitnessData() {
  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;

  const response = await fitness.users.dataset.aggregate({
    userId: 'me',
    requestBody: {
      aggregateBy: [{ dataTypeName: 'com.google.step_count.delta' }],
      bucketByTime: { durationMillis: 86400000 },
      startTimeMillis: oneDayAgo,
      endTimeMillis: now,
    },
  });

  return response.data;
}

module.exports = { getFitnessData };