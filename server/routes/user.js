import express from 'express';
const router = express.Router();

import User from '../controllers/user';
import verifyUser from '../middlewares/verifyUser';

router.post('/login', User.login);
router.post('/signup', [verifyUser.checkDuplicateMobileNoOrEmail], User.signup);

module.exports = router;
