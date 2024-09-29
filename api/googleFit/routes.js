const express = require('express');
const { getAuthUrl, getToken } = require('./auth');
const { getFitnessData } = require('./index');

const router = express.Router();

router.get('/auth', (req, res) => {
  const authUrl = getAuthUrl();
  res.redirect(authUrl);
});

router.get('/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const tokens = await getToken(code);
    // Here you would typically save the tokens to your database
    res.redirect('/dashboard'); // Redirect to your dashboard after successful auth
  } catch (error) {
    res.status(500).json({ error: 'Failed to authenticate with Google Fit' });
  }
});

router.get('/fitness-data', async (req, res) => {
  try {
    const fitnessData = await getFitnessData();
    res.json(fitnessData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fitness data' });
  }
});

module.exports = router;