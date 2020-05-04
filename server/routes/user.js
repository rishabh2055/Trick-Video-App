import express from 'express';
const router = express.Router();

import User from '../controllers/user';

router.post('/login', User.login);
router.post('/signup', User.signup);

module.exports = router;
