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

function save(data,cb){
    let u=new user(data);
    u.save(data,function(err){
        if(err){
            cb(err)
        }
        else{
          cb(null)
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
    deleteOne: deleteOne,
    save:save
}