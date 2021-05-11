const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const  User      = require("./models/user");
const userLib    = require('./lib/userlib.js');
const mongoose = require('mongoose');
const axios = require('axios');
const DateLib               = require('./date.js');
const nodemailer = require('nodemailer');
const app=express();

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'kushagra.glasscode@gmail.com',
      pass: 'kingkk@2001'
    }
  });
  
  var mailOptions = {
    from: 'kushagra.glasscode@gmail.com',
    to: '',
    subject: 'Vaccination Slot Available',
    html: '<h1>Slot for Covid-19 Vaccination is available at your desired pincode. Please prebook your slot on <a href = "https://www.cowin.gov.in/home">https://www.cowin.gov.in/home</a> as soon as possible.</h1>'
  };
  
  function tryParse(str) {
    try {
        return {value: JSON.parse(str), valid: true};
    } catch (e) {
        return {value: str, valid: false};
    }
    
}
  

app.use(express.static("public"));
const MONGO_URL="mongodb+srv://admin-vishu:Test123@cluster0.pm1eu.mongodb.net/vaccine";
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }).then( () => {
    console.log("Database connected");
  }).catch( () => {
    console.log("Database Not connected");
  });

app.set('view engine','ejs');

app.get("/", function(req, res){
    res.render("index");
});

app.post("/check", function(req,res){
   // console.log(req.body);

    const email = req.body.email;
    const pincode = parseInt(req.body.pincode);
    const age = parseInt(req.body.age);

const date = DateLib.getDate();

const url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode="+ pincode +"&date="+ date;



// axios.get(url)
//   .then(resp => {
//     resp.on("data", function(data){

//         const agePinData =  [];
        
        
       
//         const pinData = tryParse(data);
//         //console.log(pinData.value);
//         if(pinData.valid){
//         pinData.value.sessions.forEach(element => {
//             if(element.min_age_limit<=age && element.available_capacity>0){
//                 agePinData.push(element);
//             }
//         });
//         }
//         //console.log(agePinData);
//         if(agePinData.length==0){

//             const user = {Email: email, Pincode: pincode, Age: age};
//             userLib.save(user, function(err){
//                 if(err){
                    
//                     return  res.json(err);;
//                 }
//                 else{
//                     return res.render("notFound", {pin: pincode});
//                 }
//             });
           
           
           
//         }
//         else{
//             // const user = new User({Email: email, Pincode: pincode, Age: age});
//             // user.save();
//             res.render("found", {center: agePinData});
//             //res.send("<h1>Appointment for vaccination is available for this pincode</h1><p>"+ JSON.stringify(agePinData) +"</p>");
//         }
//     })



//   })
//   .catch(error => {
//     console.log(error);
//   });



https.get(url, function(resp){
    //console.log(resp.statusCode);
    resp.on("error", function(error){
        console.log(error);
        res.send(error);
    });
    resp.on("data", function(data){

        const agePinData =  [];
        
        
       
        const pinData = tryParse(data);
        //console.log(pinData.value);
        if(pinData.valid){
        pinData.value.sessions.forEach(element => {
            if(element.min_age_limit<=age && element.available_capacity>0){
                agePinData.push(element);
            }
        });
        }
        //console.log(agePinData);
        if(agePinData.length==0){

            const user = {Email: email, Pincode: pincode, Age: age};
            userLib.save(user, function(err){
                if(err){
                    
                    return  res.json(err);;
                }
                else{
                    return res.render("notFound", {pin: pincode});
                }
            });
           
           
           
        }
        else{
            // const user = new User({Email: email, Pincode: pincode, Age: age});
            // user.save();
            res.render("found", {center: agePinData});
            //res.send("<h1>Appointment for vaccination is available for this pincode</h1><p>"+ JSON.stringify(agePinData) +"</p>");
        }
    })



});
});

setInterval( () => {
    const mailList = [];
    User.find({} , (err, users) => {
        if(err) {
            console.log(err);
        }else{

        users.map( user => {
            

            const email = user.Email;
    const pincode = user.Pincode;
    const age = user.Age;

    //console.log(email+" "+ pincode + " "+ age +" ");

    const date = DateLib.getDate();        

const url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode="+ pincode +"&date="+ date;
https.get(url, function(resp){
    //console.log(resp.data);
    const agePinData =  [];
    resp.on("data", function(data){
        const pinData = tryParse(data);
        //console.log("Pin Data = ");
        //console.log(pinData.value);
        if(pinData.valid){
        pinData.value.sessions.forEach( element => {
            if(element.min_age_limit <= age && element.available_capacity>0){
                agePinData.push(element);
            }
        });
    }

        
    //console.log("Age Pin Data = ");
      //  console.log(agePinData);
        if(agePinData.length>0){
            if(!mailList.includes(email)){
            mailList.push(email);
            //console.log(mailList);
            mailOptions.to=email;
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                 const filter ={
                    Email: email
                }
                //console.log(filter);
                userLib.deleteOne(filter, function (err) {
                    if(err){
                        return console.log(err);
                    }
                    // else{
                    // console.log("Deleted  " + email);
                    // }
                });
                }
              });

                    
        }
    }
    });



});



        })
    }
    });
    // console.log("Mail List = ");
    // console.log(mailList);
    // if(mailList.length>0){
    // var mailListStr = "";
    // mailList.forEach((mail) => {
    //     const filter ={
    //         Email: mail
    //     }
    //     userLib.deleteOne(filter, function (err) {
    //         if(err){
    //             return res.json(err);
    //         }else{
    //             console.log("Deleted  " + mail);
    //         }
    //     });
    //     mailListStr+=mail;
    //     mailListStr+=", ";
    // });
    // mailListStr=mailListStr.substring(0, mailListStr.length-2);
    // mailOptions.to=mailListStr;
    // console.log(mailListStr);
    
    // transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log('Email sent: ' + info.response);
    //     }
    //   });



    // }else{
    //     console.log("No one is there in the mailing List");
    // }
    
}, 1200000);



app.listen(process.env.PORT || 2000, function(){
    console.log("Server is running on port ", process.env.PORT || 2000);
})