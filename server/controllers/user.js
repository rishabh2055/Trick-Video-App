import uuid from 'uuid';
import crypto from 'crypto';
import bcrypt from 'bcrypt-nodejs';

import model from '../models';

const UserModel = model.user;

class User{
  constructor(){

  }

  static login(req, res) {debugger
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
  }
}

module.exports = User;
