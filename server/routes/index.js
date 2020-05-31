import express from 'express';
const router = express.Router();

import user from './user';
import appointment from './appointment';
import doctors from './doctors';

router.use('/user', user);
router.use('/appointment', appointment);
router.use('/doctor', doctors);

module.exports = router;
