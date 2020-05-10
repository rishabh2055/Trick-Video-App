const uuid = require('uuid');
import models from '../models';

class Appointment{
  constructor(){

  }

  static async addNewAppointment(req, res){
    try{
      if(!req.body){
        console.error('POST .../add failed: no body provided');
        return res.status(401).send({
          message: 'New Appointment failed. no body provided'
        });
      }
      let creationDocument = {
        uid: uuid.v4(),
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
    }
  }
}

module.exports = Appointment;
