var express     = require('express');
var bodyParser  = require('body-parser');
var mongoose    = require('mongoose');
var userModel   = require('./models/user');
var bcrypt      = require('bcryptjs');

//set the connection to db
mongoose.connect('mongodb://localhost:27017/Demoo',{useNewUrlParser:true})
.then(function(){
    console.log('connected to db');
}).catch(function(error){
    console.log('error'+error);
});

var app = express();

//fetch data from request
app.use(bodyParser.json());

//register user
app.post('/register',function(req,res){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
          var userr = new userModel({
              email:req.body.email,
              password:hash
          });
          userr.save(function(err,data){
              if(err){
                  res.json({er:error});
              }else{
                  res.json({da:data,msg:'user is registerd'});
              }
          });
        });
    });
});

//user login
app.post('/login',function(req,res){
    userModel.find({email:req.body.email},function(err,data){
        if(err){
            res.json({er:err});
        }else{
            if(data!=''){
                bcrypt.compare(req.body.password,data[0].password, function(err, result) {
                     if(result){
                          res.json({msg:'password matched'});
                     }else{
                         res.json({msg:'password didnt matched'});
                     }
                });
            }
            else{
                res.json({msg:'user is not registerd'});
            }
        }
    });
});

var port = process.env.PORT || 3000;
app.listen(port,function(){
    console.log('server running at '+port);
});