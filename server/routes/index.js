import express from 'express';
const router = express.Router();

import user from './user';
import appointment from './appointment';

router.use('/user', user);
router.use('/appointment', appointment);

module.exports = router;
