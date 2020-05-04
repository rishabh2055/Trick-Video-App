const uuid = require('uuid');
import models from '../models';
import bcrypt from 'bcrypt-nodejs';

class User{
  constructor(){

  }

  static login(req, res) {
    try{
      if(!req.body){
        console.error('POST .../login failed: no body provided');
        return res.status(401).send({
          message: 'Authentication failed. no body provided'
        });
      }
      const mobilNo = req.body.mobileNo;
      const password = req.body.password;
      if((mobilNo === '' || mobilNo === undefined) || (password === '' || password === undefined)){
        console.error('POST .../login failed: mobileNo or password is required');
        return res.status(401).send({
          message: 'Authentication failed. MobileNo or Password is required'
        });
      }else{

      }
    }catch(error){
      console.error(`Error on POST .../login failed: ${error}`);
    }
  }

  static async validateNewUser(postData){
    try{
      let responseObj = {email: true, mobileNo: true};
      // Check with existing records that has mobile no equal to posted mobile no
      const checkForMobileNo = await models.users.findOne({
        where:{
          mobileNo: postData.mobileNo
        },
        attributes: ['id']
      });

      if(checkForMobileNo && checkForMobileNo.id){
        console.error('POST.../signup failed: mobile no already exists');
        responseObj.mobileNo = false;
      }

      // Check with existing records that has email equal to posted email
      const checkForEmail = await models.users.findOne({
        where:{
          email: postData.email
        },
        attributes: ['id']
      });

      if(checkForEmail && checkForEmail.id){
        console.error('POST.../signup failed: email already exists');
        responseObj.email = false;
      }
      return responseObj;
    }catch(err){
      console.error(`Error on POST .../signup validation failed: ${error}`);
    }
  }

  static async signup(req, res){
    try{
      if(!req.body){
        console.error('POST .../signup failed: no body provided');
        return res.status(401).send({
          message: 'Registration failed. no body provided'
        });
      }

      // Validating input fields
      const validatingUser = await User.validateNewUser(req.body);
      if(validatingUser && !validatingUser.email){
        return res.status(400).send({
          message: "Email is already taken."
        });
      }else if(validatingUser && !validatingUser.mobileNo){
        return res.status(400).send({
          message: "Mobile no is already taken."
        });
      }else{
        const now = new Date();
        let creationDocument = {
          uid: uuid.v4(),
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          mobileNo: req.body.mobileNo,
          isDoctor: req.body.isDoctor,
          hash: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
          invalidAttempt: 0,
          isActive: true,
          createdOn: now,
          updatedOn: now
        }
        // Save new user records in one transaction
        await models.sequelize.transaction(async t => {debugger
          // now save the document
          let creation = await models.users.create(creationDocument, {transaction: t});
          const sanitisedResults = creation.get({plain: true});

          if(req.body.isDoctor === 'Yes'){
            //Save doctor details on doctor table
            let createDoctorDocument = {
              uid: uuid.v4(),
              userId: sanitisedResults.ID,
              clinicName: req.body.clinicName,
              registrationNo: req.body.registrationNo,
              reatedOn: now,
              updatedOn: now
            }
            await models.doctors.create(createDoctorDocument, {transaction: t});
          }
          let returnSavedResponse = {
            id: sanitisedResults.ID,
            createdOn: sanitisedResults.createdOn,
            updatedOn: sanitisedResults.updatedOn
          }
          return res.status(200).json(returnSavedResponse);
        });
      }
    }catch(error){
      console.error(`Error on POST .../signup failed: ${error}`);
    }
  }
}

module.exports = User;
