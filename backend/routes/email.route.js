import express from 'express';
import { createEmail, getEmails, deleteEmail } from '../controllers/email.controller.js';

const router = express.Router();
router.post('/create', createEmail);

router.get('/', getEmails);

router.delete('/:id', deleteEmail);

export default router;