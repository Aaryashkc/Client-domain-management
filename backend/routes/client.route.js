import express from 'express';
import { createClient, getClients, getClient, toggleClientStatus } from '../controllers/client.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';


const router = express.Router();


router.post('/create', protectRoute, createClient);


router.get('/', protectRoute, getClients);


router.get('/:id', protectRoute, getClient);

router.put('/toggle-status/:id', protectRoute, toggleClientStatus);

export default router;
