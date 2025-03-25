import express from 'express';
import { createClient, getClients, getClient, toggleClientStatus } from '../controllers/client.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';


const router = express.Router();

// Create a new client
router.post('/create', protectRoute, createClient);

// Retrieve all clients
router.get('/', protectRoute, getClients);

// Retrieve a single client by ID
router.get('/:id', protectRoute, getClient);

router.put('/toggle-status/:id', protectRoute, toggleClientStatus);

export default router;
