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

router.post('/register', function (req, res, next) {
  var jsonList;
  var user = [];
  var email = [];
  fs.readFile(__dirname + "/user.json", function (err, list) {
    if (err) throw err;
    jsonList = JSON.parse(list);
    var alreadyUser = false;
    jsonList.user.forEach(function (item) {
      if (item.email == req.body.email) {
        alreadyUser = true;
      }
      var schema = {
        name: item.name,
        email: item.email
      };
      usersEmail.push(schema);
    })
    if (alreadyUser == false) {
      userSchema.name = req.body.name;
      userSchema.email = req.body.email;
      userSchema.password = req.body.psw;
      jsonList.user.push(userSchema);
      fs.writeFile(__dirname + "/user.json", JSON.stringify(jsonList), function (err) {
        if (err) throw err;
        console.log('Saved!');
        res.render('user', { usr: usersEmail });
      });
    }
    else {
      res.write('Email already Exist!! Please use different email');
    }
  });
});

router.post('/status', function (req, res, next) {
  var transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: 'pawan.kumar10@zoho.com',
      pass: 'Pa@9708677704'
    }
  });
  var mailOptions = {
    from: 'pawan.kumar10@zoho.com', // sender address (who sends)
    to: req.body.child,
    bcc: 'pawan.bcet54@gmail.com', // list of receivers (who receives) req.body.child
    subject: 'Task for Today', // Subject line
    //text: req.body.request.text, // plaintext body
    html: 'Dear Child,<p> There is new task for you as below:</p><p>' + req.body.task + '</p> <p> Thanks <br/>Team Suslence</p>' // html body
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.send(error);
    }else{
     res.render('sendSuccess');
    }
  });
});




module.exports = router;
