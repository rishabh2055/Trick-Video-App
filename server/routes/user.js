import express from 'express';
const router = express.Router();

import User from '../controllers/user';
import verifyUser from '../middlewares/verifyUser';
import authReq from '../middlewares/authJWT';

router.post('/login', User.login);
router.post('/signup', [verifyUser.checkDuplicateMobileNoOrEmail], User.signup);
router.get('/:uid/me', [authReq.verifyToken], User.getMe);

module.exports = router;
