import express from 'express';
const router = express.Router();

import app from '../../server';
import user from './user';

router.get('/', (req, res) => {
  res.json({message: "API call initiated !"});
});

router.use('/user', user);

module.exports = router;
