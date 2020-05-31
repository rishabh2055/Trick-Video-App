import express from 'express';
const router = express.Router();

import Doctor from '../controllers/doctor';
import authReq from '../middlewares/authJWT';

router.post('/department/add', [authReq.verifyToken], Doctor.saveDoctorsDepartment);
router.get('/department/all', [authReq.verifyToken], Doctor.allDoctorsDepartment);
router.post('/:uid', [authReq.verifyToken, authReq.isDoctor], Doctor.updateDoctorProfile);

module.exports = router;
