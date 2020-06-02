const uuid = require('uuid');
import models from '../models';
import { QueryTypes } from'sequelize';

const now = new Date();

class Communication{
  constructor(){}

  static async getAll(req, res){
    try{
      const communicationQuery = `
      SELECT "ID" AS "id", "CommunicationUID" AS "uid", "FromUserID" AS "fromUserId",
      "ToUserID" AS "toUserId", "RoomName" AS "roomName", "Message" AS "message",
      "CreatedOn" AS "createdOn", "UpdatedOn" AS "updatedOn" FROM "videoapp"."communications" AS "communications"
      WHERE ("communications"."FromUserID" = :fromId OR "communications"."ToUserID" =:fromId)
           AND ("communications"."FromUserID" = :toId OR "communications"."ToUserID" = :toId);
      `
      const communicationList = await models.sequelize.query(communicationQuery,
        {
          replacements: {
            fromId: req.query.from,
            toId: req.query.to
          },
          type: QueryTypes.SELECT
        });
      // const communicationList = await models.communications.findAll({
      //   where: {
      //     [models.Sequelize.Op.or]: [
      //       { fromUserId: req.query.from },
      //       { toUserId: req.query.from }
      //     ],
      //     [models.Sequelize.Op.or]: [
      //       { fromUserId: req.query.to },
      //       { toUserId: req.query.to }
      //     ]
      //   },
      //   raw: true
      // });
      return res.status(200).json(communicationList);
    }catch(error){
      console.error(`Error on GET .../communication failed: ${error}`);
      return res.status(503).json({
        message: 'Failed to get all communications list'
      });
    }
  }

  static async saveCommunication(req, res){
    try{
      if (!req.body) {
        console.error('POST .../communication failed: no body provided');
        return res.status(400).send({
          message: 'New Communication failed. no body provided'
        });
      }
      // check both user details (sender and reciever)
      const senderDetails = await models.users.findOne({
        where:{
          id: req.body.fromUserId
        }
      });
      if(senderDetails && senderDetails.id){
        const recieverDetails = await models.users.findOne({
          where: {
            id: req.body.toUserId
          }
        });
        if(recieverDetails && recieverDetails.id){
          let creationDocument = {
            uid: uuid.v4(),
            fromUserId: req.body.fromUserId,
            toUserId: req.body.toUserId,
            roomName: req.body.roomName,
            message: req.body.message,
            createdOn: now,
            updatedOn: now
          }
          await models.sequelize.transaction(async t => {
            // now save the document
            let creation = await models.communications.create(creationDocument, { transaction: t });
            const sanitisedResults = creation.get({ plain: true });
            const returnSavedResponse = {
              id: sanitisedResults.ID,
              createdOn: sanitisedResults.createdOn,
              updatedOn: sanitisedResults.updatedOn
            };
            return res.status(200).json(returnSavedResponse);
          });
        }else{
          console.error('POST .../communication failed: reciever invalid');
          return res.status(400).send({
            message: 'New Communication failed. reciever invalid'
          });
        }
      }else{
        console.error('POST .../communication failed: sender invalid');
        return res.status(400).send({
          message: 'New Communication failed. sender invalid'
        });
      }
    }catch(error){

    }
  }
}

module.exports = Communication;
