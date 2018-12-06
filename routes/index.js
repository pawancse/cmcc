var express = require('express');
var router = express.Router();
var fs = require('fs');
var nodemailer = require('nodemailer');

var userSchema = {
  name: "",
  email: "",
  password: ""
};

var usersEmail = [];

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/login', function (req, res, next) {
  var user = [];
  var email = [];
  fs.readFile(__dirname + "/user.json", function (err, list) {
    if (err) throw err;
    jsonList = JSON.parse(list);
    var found = false;
    jsonList.user.forEach(function (item) {
      if ((item.email == req.body.email) && (item.password == req.body.psw)) {
        found = true;
      }
      var schema = {
        name: item.name,
        email: item.email
      };
      usersEmail.push(schema);
    })
    if (found == true) {
      res.render('user', { usr: usersEmail });
    }
    else {
      res.write('Invalid credentials');
    }
  });
});

router.post('/changepassword', function (req, res, next) {
  var jsonList;
  var user = [];
  var email = [];
  fs.readFile(__dirname + "/user.json", function (err, list) {
    if (err) throw err;
    jsonList = JSON.parse(list);
    var alreadyUser = false;
    jsonList.user.forEach(function (item) {
      if (item.email == req.body.email) {
        //user exist
        if (item.password == req.body.epsw) {
          item.password = req.body.npsw;
        }
      }
    })
    fs.writeFile(__dirname + "/user.json", JSON.stringify(jsonList), function (err) {
      if (err) throw err;
      console.log('Password Changed!');
      res.send('Your password is changed! <a href="/"> Click here to login</a>')
    });
  });
});

router.post('/status', function (req, res, next) {
  var transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: 'pawan.kumar10@zoho.com',
      pass: process.env.mailpass
    }
  });
  var list = req.body.child.split("@@");
  var email = list[0];
  var name = list[1];
  var mailOptions = {
    from: 'pawan.kumar10@zoho.com', // sender address (who sends)
    to: email,
    bcc: ['pawan.bcet54@gmail.com','nishanmadhavan@gmail.com','nithya.greens@gmail.com','dineshramt@gmail.com','tharanyaece@gmail.com','jananisarathi@gmail.com','jeeviparthi1997@gmail.com','kiranasattigigeri@gmail.com','priyapradeep5617@gmail.com','dhasarathys@gmail.com','bhavyateja555@gmail.com','syed.ameer27@gmail.com','premk6491@gmail.com','subbuviswa94.sastra@gmail.com'], // list of receivers (who receives) req.body.child
    subject: 'Task for Today', // Subject line
    //text: req.body.request.text, // plaintext body
    html: 'Dear '+ name +',<p> There is new task for you as below:</p><p>' + req.body.task + '</p> <p> Thanks <br/>Atlas GPO</p>' // html body
  };
  console.log(mailOptions);
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.send(error);
    } else {
      res.render('sendSuccess');
    }
  });
});




module.exports = router;
