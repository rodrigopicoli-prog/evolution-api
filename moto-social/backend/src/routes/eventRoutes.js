const { Router } = require('express');
const { z } = require('zod');
const eventController = require('../controllers/eventController');
const { authMiddleware, adminOnly } = require('../middlewares/authMiddleware');
const { optionalAuthMiddleware } = require('../middlewares/optionalAuthMiddleware');
const { validate } = require('../middlewares/validate');

const router = Router();

const eventSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional().or(z.literal('')),
  city: z.string().min(2),
  state: z.string().max(2),
  placeName: z.string().min(2),
  coverUrl: z.string().url().optional(),
  category: z.string().optional(),
  status: z.enum(['pending', 'approved', 'hidden']).optional(),
});

const statusSchema = z.object({
  status: z.enum(['pending', 'approved', 'hidden']),
});

router.get('/', optionalAuthMiddleware, eventController.list);
router.get('/mine', authMiddleware, eventController.listMine);
router.get('/:id', optionalAuthMiddleware, eventController.getById);
router.post('/', authMiddleware, validate(eventSchema), eventController.create);
router.put('/:id', authMiddleware, validate(eventSchema), eventController.update);
router.patch('/:id/status', authMiddleware, adminOnly, validate(statusSchema), eventController.changeStatus);
router.post('/:id/favorite', authMiddleware, eventController.favorite);
router.delete('/:id/favorite', authMiddleware, eventController.unfavorite);

module.exports = { eventRoutes: router };
