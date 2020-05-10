import express from 'express';
const router = express.Router();

import Appointment from '../controllers/appointment';
import authReq from '../middlewares/authJWT';

router.post('/add', [authReq.verifyToken, authReq.isDoctor], Appointment.addNewAppointment);

module.exports = router;
