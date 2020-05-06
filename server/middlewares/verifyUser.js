import models from '../models';

exports.checkDuplicateMobileNoOrEmail = async (req, res, next) => {
  const checkForMobileNo = await models.users.findOne({
    where:{
      mobileNo: req.body.mobileNo
    }
  });
  if(checkForMobileNo && checkForMobileNo.id){
    console.error("Failed! mobile no is already in use");
    return res.status(400).send({
      message: "Mobile no is already in use"
    });
  }else{
    const checkForEmail = await models.users.findOne({
      where:{
        email: req.body.email
      }
    });
    if(checkForEmail && checkForEmail.id){
      console.error("Failed! Email is already in use");
      return res.status(400).send({
        message: "Email is already in use"
      });
    }else{
      next();
    }
  }
};
