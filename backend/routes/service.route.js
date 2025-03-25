import express from 'express';
import { createService, getServices, getService} from '../controllers/service.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { sendServiceEmail } from '../controllers/mail.controller.js';

const router = express.Router();

router.post('/', protectRoute, createService);

router.get('/', protectRoute, getServices);

router.get('/:id', protectRoute, getService);

router.post('/send-email/:id', protectRoute, sendServiceEmail);

export default router;
