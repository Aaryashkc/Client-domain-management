import express from 'express';
import { createServiceProvider, getAllServiceProviders, getServiceProvider } from '../controllers/serviceProvider.controller.js';

const router = express.Router();

router.post('/create', createServiceProvider);

router.get('/', getAllServiceProviders);

router.get('/:id', getServiceProvider);

export default router;
