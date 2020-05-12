const uuid = require('uuid');
import models from '../models';
import bcrypt from 'bcrypt-nodejs';
import jwt from 'jsonwebtoken';
import config from '../config/auth.config';

import * as moment from 'moment';

const now = new Date();
const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/;
class User{
  constructor(){

  }

  static async login(req, res) {
    try{
      if(!req.body){
        console.error('POST .../login failed: no body provided');
        return res.status(400).send({
          message: 'Authentication failed. no body provided'
        });
      }
      const mobileNo = req.body.mobileNo;
      const password = req.body.password;
      if((mobileNo === '' || mobileNo === undefined) || (password === '' || password === undefined)){
        console.error('POST .../login failed: mobileNo or password is required');
        return res.status(400).send({
          message: 'Authentication failed. MobileNo or Password is required'
        });
      }else{
        // Find user details
        const userDetails = await models.users.findOne({
          where:{
            mobileNo: mobileNo
          },
          raw: true
        });
        if(!userDetails || !userDetails.id){
          console.error('POST.../login failed: mobile no not found');
          return res.status(400).send({
            message: 'Invalid mobile no or password'
          });
        }else if(!userDetails.isActive){
          console.error(`POST .../login failed: User status is not active`);
          return res.status(405).send({
            message: 'Authentication failed.',
          });
        }else{
          // Password doesn't match
          if(!bcrypt.compareSync(password, userDetails.hash)){
            console.error("POST.../login failed: password doesn't match");
          return res.status(400).send({
            message: 'Invalid mobile no or password'
          });
          }else{
            // check lastLogin and firstLogin
            await models.sequelize.transaction(async t => {
              if(userDetails.firstLogin === null){
                await models.users.update({
                  firstLogin: true,
                  lastLogin: now
                },
                {
                  returning: true,
                  where: {
                      uid: userDetails.uid
                  },
                  attributes: ['id', 'updated'],
                  transaction: t,
                }
                );
                userDetails.firstLogin = true;
              }else{
                await models.users.update({
                  firstLogin: false,
                  lastLogin: now
                },
                {
                  returning: true,
                  where: {
                      uid: userDetails.uid
                  },
                  attributes: ['id', 'updated'],
                  transaction: t,
                }
                );
              }
            });

            // Password match
            const expiresIn = 60 * 5 * 1000; // 5 minute
            const token = jwt.sign(userDetails, config.secret, {
              expiresIn: expiresIn
            });
            res.status(200).send({
              user: userDetails,
              accessToken: token
            });
          }
        }
      }
    }catch(error){
      console.error(`Error on POST .../login failed: ${error}`);
      return res.status(503).json({
        message: 'Failed to login'
      });
    }
  }

  static async signup(req, res){
    try{
      if(!req.body){
        console.error('POST .../signup failed: no body provided');
        return res.status(400).send({
          message: 'Registration failed. no body provided'
        });
      }

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
      await models.sequelize.transaction(async t => {
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
    }catch(error){
      console.error(`Error on POST .../signup failed: ${error}`);
      return res.status(503).json({
        message: 'Failed to register new user'
      });
    }
  }

  static async getMe(req, res){
    try{
      const userUid = req.params.uid;
      if (!uuidRegex.test(userUid.toUpperCase())) {
        console.error('GET .../me failed: Invalid user UUID');
        return res.status(400).send({
          message: 'Invalid user UUID'
        });
      }
      const userDetails = req.user;
      if(userDetails.isDoctor){
        const doctorDetails = await models.doctors.findOne({
          where: {
            userId: userDetails.id
          },
          raw: true
        });
        if(doctorDetails){
          userDetails.doctorProfile = doctorDetails;
        }
      }
      return res.status(200).json(userDetails);
    }catch(error){
      console.error(`Error on GET .../me failed: ${error}`);
      return res.status(503).json({
        message: 'Failed to get user details'
      });
    }
  }
}

module.exports = User;
