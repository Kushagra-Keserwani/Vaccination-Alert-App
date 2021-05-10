const user = require("../models/user");

function findbyId(filter,cb){
    user.find(filter,function(err,docs){
        if(err){
            cb(err)
        }
        else{
          cb(null,docs)
        }
     });
}

function deleteOne(filter, cb){
    user.deleteOne(filter, function (err) {
        if(err){
            cb(err)
        }
        else{
          cb(null)
        }
    });
}

module.exports={
    findbyId:findbyId,
    deleteOne: deleteOne
}