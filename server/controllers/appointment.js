const uuid = require('uuid');
import models from '../models';

const now = new Date();

class Appointment{
  constructor(){

  }

  static async getAllAppointments(req, res){
    try{
      const appointmentLists = await models.appointments.findAll({
        where: {
          doctorId: req.user.id
        },
        raw: true
      });
      if(appointmentLists){
        // Get all deleted appointments
        const deletedAppointmentLists = await models.deletedAppointments.findAll({
          where: {
            doctorId: req.user.id
          },
          raw: true
        });
        if(deletedAppointmentLists){
          return res.status(200).send({
            appointments: {
              all: appointmentLists,
              deleted: deletedAppointmentLists
            }
          });
        }
      }
    }catch(error){
      console.error(`Error on GET /appointment failed: ${error}`);
      return res.status(503).json({
        message: 'Failed to get all appointments'
      });
    }
  }

  static async addNewAppointment(req, res){
    try{
      if(!req.body){
        console.error('POST .../add failed: no body provided');
        return res.status(400).send({
          message: 'New Appointment failed. no body provided'
        });
      }
      let creationDocument = {
        uid: uuid.v4(),
        doctorId: req.user.id,
        title: req.body.apptTitle,
        description: req.body.apptDescription,
        fromDate: req.body.fromDate,
        fromTime: req.body.fromTime,
        toDate: req.body.toDate,
        toTime: req.body.toTime,
        isActive: true,
        createdOn: now,
        updatedOn: now
      }
      // Save new user records in one transaction
      await models.sequelize.transaction(async t => {
        // now save the document
        let creation = await models.appointments.create(creationDocument, {transaction: t});
        const sanitisedResults = creation.get({plain: true});
        let returnSavedResponse = {
          id: sanitisedResults.ID,
          createdOn: sanitisedResults.createdOn,
          updatedOn: sanitisedResults.updatedOn
        }
        return res.status(200).json(returnSavedResponse);
      });
    }catch(error){
      console.error(`Error on POST .../add failed: ${error}`);
      return res.status(503).json({
        message: 'Failed to save appointment details'
      });
    }
  }

  static async deleteAppointment(req, res){
    try{
      if(!req.body){
        console.error('POST .../add failed: no body provided');
        return res.status(400).send({
          message: 'Delete Appointment failed. no body provided'
        });
      }
      let creationDocument = {
        uid: uuid.v4(),
        doctorId: req.user.id,
        fromDate: req.body.fromDate,
        fromTime: req.body.fromTime,
        toDate: req.body.toDate,
        toTime: req.body.toTime,
        createdOn: now,
        updatedOn: now
      }
      // Save new user records in one transaction
      await models.sequelize.transaction(async t => {
        // now save the document
        let creation = await models.deletedAppointments.create(creationDocument, {transaction: t});
        const sanitisedResults = creation.get({plain: true});
        let returnSavedResponse = {
          id: sanitisedResults.ID,
          createdOn: sanitisedResults.createdOn,
          updatedOn: sanitisedResults.updatedOn
        }
        return res.status(200).json(returnSavedResponse);
      });
    }catch(error){
      console.error(`Error on POST .../add failed: ${error}`);
      return res.status(503).json({
        message: 'Failed to save appointment details'
      });
    }
  }
}

module.exports = Appointment;
