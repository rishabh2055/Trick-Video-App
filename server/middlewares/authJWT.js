import models from '../models';
import jwt from 'jsonwebtoken';
import config from '../config/auth.config';

exports.verifyToken = (req, res, next) => {
  const token = getToken(req.headers['authorization']);
  if (!token) {
    console.error("Token is not provided");
    return res.status(403).send({
      message: "Access denied! no token provided."
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      console.error("Token not valid");
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.user = decoded;
    next();
  })
};

const getToken = headers => {
  if (headers) {

    let token = headers;

    if (token.startsWith('Bearer')) {
      token = token.slice(7, token.length);
    }
    return token;
  }
  return null;
};

exports.isDoctor = async (req, res, next) => {
  const userDetails = await models.users.findOne({
    where:{
      uid: req.user.uid,
      isActive: true
    }
  });
  if(userDetails && !userDetails.isDoctor){
    console.error("Logged in user should be doctor only");
    return res.status(403).send({
      message: "Access denied! logged in user should be doctor only"
    });
  }else{
    next();
  }
};

exports.isPatient = async (req, res, next) => {
  const userDetails = await models.users.findOne({
    where:{
      uid: req.user.uid,
      isActive: true
    }
  });
  if(userDetails && userDetails.isDoctor){
    console.error("Logged in user should be patient only");
    return res.status(403).send({
      message: "Access denied! logged in user should be patient only"
    });
  }else{
    next();
  }
};
