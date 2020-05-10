import express from 'express';
const router = express.Router();

import user from './user';
import appointment from './appointment';

router.get('/', (req, res) => {
  res.json({message: "API call initiated !"});
});

router.use('/user', user);
router.use('/appointment', appointment);

module.exports = router;
