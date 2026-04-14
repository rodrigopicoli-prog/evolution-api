const { Router } = require('express');
const { z } = require('zod');
const bandController = require('../controllers/bandController');
const { authMiddleware, adminOnly } = require('../middlewares/authMiddleware');
const { optionalAuthMiddleware } = require('../middlewares/optionalAuthMiddleware');
const { validate } = require('../middlewares/validate');

const router = Router();

const bandSchema = z.object({
  stageName: z.string().min(2),
  description: z.string().min(10),
  city: z.string().min(2),
  state: z.string().max(2),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  photoUrl: z.string().url().optional(),
  status: z.enum(['pending', 'approved', 'hidden']).optional(),
});

const statusSchema = z.object({
  status: z.enum(['pending', 'approved', 'hidden']),
});

router.get('/', optionalAuthMiddleware, bandController.list);
router.get('/:id', optionalAuthMiddleware, bandController.getById);
router.post('/', authMiddleware, validate(bandSchema), bandController.create);
router.put('/:id', authMiddleware, validate(bandSchema), bandController.update);
router.patch('/:id/status', authMiddleware, adminOnly, validate(statusSchema), bandController.changeStatus);

module.exports = { bandRoutes: router };
