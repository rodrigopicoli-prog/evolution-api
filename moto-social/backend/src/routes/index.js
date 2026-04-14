const { Router } = require('express');
const { authRoutes } = require('./authRoutes');
const { eventRoutes } = require('./eventRoutes');
const { bandRoutes } = require('./bandRoutes');

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});
router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/bands', bandRoutes);

module.exports = { apiRoutes: router };
