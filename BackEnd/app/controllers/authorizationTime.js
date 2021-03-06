
import moment from 'moment';

import AuthorizationTime from "../models/authorizationTime";

import Ramo from "../models/ramo";
import Insurance from "../models/insurance";
import Branch from "../models/branch";

let authorizationTimeController = function (app, control={auth, passport, acl}){

   function controller (req, res, next) {
      req.controller = "authorizationTime";
      return next();
   }

   function findAction (callback){
      let $filter =  global.filter(null);
      AuthorizationTime.find($filter, function (err, docs) {
         if (!err) {
            
            Ramo.populate(docs, {path: "ramo"},function(err, docs){
               Insurance.populate(docs, {path: "insurance"},function(err, docs){
                  Branch.populate(docs, {path: "branch"},function(err, docs){
                     callback(docs);
                  });
               });
            });
         }
      });
   }

   app.post('/authorizationTime/filter',[control.auth, controller], (req, res) => {
      let $filter =  global.filter(req.body.filter);
      AuthorizationTime.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            Ramo.populate(docs, {path: "ramo"},function(err, docs){
               Insurance.populate(docs, {path: "insurance"},function(err, docs){
                  Branch.populate(docs, {path: "branch"},function(err, docs){
                     res.send({msg: "OK", authorizationTimes: docs});
                  });
               });
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/authorizationTime/list', [control.auth, controller, control.acl], (req, res) => {
      let $filter =  global.filter(null);
      AuthorizationTime.find($filter, function (err, docs) {
         if (typeof docs !== 'undefined') {
            control.log(req.route.path, req.user);

            Ramo.populate(docs, {path: "ramo"},function(err, docs){
               Insurance.populate(docs, {path: "insurance"},function(err, docs){
                  Branch.populate(docs, {path: "branch"},function(err, docs){
                     res.send({msg: "OK", authorizationTimes: docs});
                  });
               });
            });
            
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.get('/authorizationTime/view/:id', [control.auth, controller, control.acl], (req, res) => {

      AuthorizationTime.findById(req.params.id, function (err, doc) {
         if (!err) {
            control.log(req.route.path, req.user);
            res.send({msg: "OK", authorizationTime: doc});
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.post('/authorizationTime/add', [control.auth, controller, control.acl], (req, res) => {

      let authorizationTime = new AuthorizationTime({
         idRamo: req.body.idRamo,
         ramo: req.body.idRamo,
         idInsurance: req.body.idInsurance,
         insurance: req.body.idInsurance,
         idBranch: req.body.idBranch,
         branch: req.body.idBranch,
         time: req.body.time,
         dateCreate: moment(),
         userCreate: req.user.idUser,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      });

      let dataFilter = {
         "$and" : [
            {"idRamo": req.body.idRamo},
            {"idInsurance": req.body.idInsurance},
            {"idBranch": req.body.idBranch}
         ]
      }

      authorizationTime.save((err, doc) => {
         if(!err){
            findAction(function(docs){
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }            
      });

      /*AuthorizationTime.find(dataFilter, function (err, docs) {
         if(!err){
            if(!docs){
               authorizationTime.save((err, doc) => {
                  if(!err){
                     findAction(function(docs){
                        control.log(req.route.path, req.user);
                        res.send({msg: "OK", update: docs});
                     });
                  } else {
                     let error=global.error(err, 0, req.controller);
                     res.send({msg: 'ERROR', err: error});
                  }            
               });
            } else{
               let error=global.error({duplicated: 3}, 1, req.controller);
               res.send({msg: 'ERROR', err: error});
            }
         }
      });*/

   });

   app.post('/authorizationTime/edit/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         idRamo: req.body.idRamo,
         ramo: req.body.idRamo,
         idInsurance: req.body.idInsurance,
         insurance: req.body.idInsurance,
         idBranch: req.body.idBranch,
         branch: req.body.idBranch,
         time: req.body.time,
         dateUpdate: moment(),
         userUpdate: req.user.idUser
      };

      AuthorizationTime.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

   });

   app.delete('/authorizationTime/delete/:id', [control.auth, controller, control.acl], (req, res) => {

      let filter = {
         _id: req.params.id
      }

      let update = {
         dateDelete: moment()
      };

      AuthorizationTime.findOneAndUpdate(filter, update, function (err, doc) {
         if (!err) {
            findAction(function(docs){
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }
      });

      /*let filter = {
         _id: req.params.id
      }

      AuthorizationTime.findByIdAndRemove(filter, function (err, doc) {
         if(!err){
            findAction(function(docs){
               control.log(req.route.path, req.user);
               res.send({msg: "OK", update: docs});
            });
         } else {
            let error=global.error(err, 0, req.controller);
            res.send({msg: 'ERROR', err: error});
         }            
      });*/

   });

}

export default authorizationTimeController
