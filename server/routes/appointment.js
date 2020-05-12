import express from 'express';
const router = express.Router();

import Appointment from '../controllers/appointment';
import authReq from '../middlewares/authJWT';

router.get('/', [authReq.verifyToken, authReq.isDoctor], Appointment.getAllAppointments);
router.post('/add', [authReq.verifyToken, authReq.isDoctor], Appointment.addNewAppointment);
router.post('/delete', [authReq.verifyToken, authReq.isDoctor], Appointment.deleteAppointment);

module.exports = router;
