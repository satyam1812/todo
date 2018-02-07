var express = require("express");
var path = require("path");
var app = express();
const fileUpload = require('express-fileupload');
var mysql = require('mysql');
var md5 = require('md5');
var bodyParser = require('body-parser');
var multer = require('multer');

app.use(express.static(path.join(__dirname, "views")));
app.use(express.static(path.join(__dirname, "uploads")));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads/user');
    },
    filename: function(req, file, callback) {
        var fileUniqueName = md5(Date.now());
        callback(null,  fileUniqueName + path.extname(file.originalname));
    }
});

var upload = multer({ storage: storage });


//---------------------FOR DATABASE CONNECTION-----------------------------------------------//
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'fluper_user'
});
 
connection.connect(function(err){
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('database working fine');
});
 


//-------------------------For adminlogin------------------------------------------------//

app.post('/adminlogin', function(req, res) {
	var email = req.body.email;
	var password = req.body.password;

	var sql = "SELECT * FROM `admin` WHERE `emailId`=? AND `password`=?";
	var password = md5(password);
	var values = [email,password];
	console.log(values);

	connection.query(sql, values, function(err, result){
		console.log(err);
		console.log(result);
		if (err) {
			console.log(err);
		} else {
			if(result.length>0)
				{
					result[0].password="";
					var response={
						status:1, 
						response: result[0]
					}

					res.send(response);
				}
				else{
					var response ={
						status:0,

						response:"invalid cretdential"

					}
					res.send(response);
				}
			}
		});
});

//-------------------------For userlogin------------------------------------------------//

app.post('/userlogin', function(req, res) {
	var email = req.body.email;
	var password = req.body.password;

	var sql = "SELECT * FROM `user1` WHERE `emailId`=? AND `password`=?";
	var password = md5(password);
	var values = [email,password];
	console.log(values);

	connection.query(sql, values, function(err, result){
		console.log(err);
		console.log(result);
		if (err) {
			console.log(err);
		} else {
			if(result.length>0)
				{
					result[0].password="";
					var response={
						status:1, 
						response: result[0]
					}

					res.send(response);
				}
				else{
					var response ={
						status:0,

						response:"invalid cretdential"

					}
					res.send(response);
				}
			}
		});
});


 //----------------------------For signup----------------------------------------------//
app.post('/adminsignup', function(req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	var contact  = req.body.contact;
	  var text = "";
    var possible = "123456789";

    for (var i = 0; i < 4; i++) {
        text += possible.charAt(Math.floor(Math.random() *
		possible.length));
    }
	var user_id = md5(text);
	var password=md5(password);
	var sql = "SELECT * FROM `admin` WHERE `emailId`=?";
	var values = [email, password];

	connection.query(sql, values, function(err, result){
		if (err) {
			console.log(err);
		} else if (result.length > 0 ){
			res.send('Email is already registered');
		} else {
			var sql = "INSERT INTO `admin`(`user_ID`, `userName`, `emailId`, `password`,`contactNo`) VALUES (?,?,?,?,?)";
			var values = [user_id, name, email, password , contact];

			connection.query(sql, values, function(err, result){
				if (err) {
					console.log(err);
				} else {
					res.send('success');
				}
			});
		}
	});    
});


 //----------------------------For  user signup----------------------------------------------//
app.post('/usersignup', function(req, res) {
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	var contact  = req.body.contact;
	  var text = "";
    var possible = "123456789";

    for (var i = 0; i < 4; i++) {
        text += possible.charAt(Math.floor(Math.random() *
		possible.length));
    }
	var user_id = md5(text);
	var password=md5(password);
	var sql = "SELECT * FROM `user1` WHERE `emailId`=?";
	var values = [email, password];

	connection.query(sql, values, function(err, result){
		if (err) {
			console.log(err);
		} else if (result.length > 0 ){
			res.send('Email is already registered');
		} else {
			var sql = "INSERT INTO `user1`(`user_ID`, `userName`, `emailId`, `password`,`contactNo`) VALUES (?,?,?,?,?)";
			var values = [user_id, name, email, password , contact];

			connection.query(sql, values, function(err, result){
				if (err) {
					console.log(err);
				} else {
					res.send('success');
				}
			});
		}
	});
});

 
//--------------------------------------TO GET TASK----------------------------------------------//
app.post('/gettask', function(req, res) {
	var name = req.body.task_name;
	var date = req.body.task_date;
	var user_id = req.body.user_id;
	 var task_desc = req.body.DESCRIPTION;


	var sql = "INSERT INTO `task`(`user_ID`, `task_Name`, `task_date`,`task_desc`) VALUES (?,?,?,?)";
	var values = [user_id,name,date,task_desc];

	connection.query(sql, values, function(err, result){
		if (err) {
			console.log(err);
		} else {
			res.send('success');
		}
	});

});


//=======================================update task================================================//

app.post('/update', function(req, res) {
	var name = req.body.task_name;
	var date = req.body.task_date;
	var user_id = req.body.user_id;
	var task_desc = req.body.task_desc;

	var sql = "update task set `task_name`=? , `task_date`=? , `task_desc`=? WHERE `user_ID`=? ";
	var values = [name,date,task_desc,user_id];

	connection.query(sql, values, function(err, result){
		if (err) {
			console.log(err);
		} else {
			res.send('success');
		}
	});

});


//===============================delete task=============================================//

app.post('/delete', function(req, res) {
	
	var user_id = req.body.user_id;

	var sql = "delete FROM `task` WHERE `user_ID`=?";
	var values = [user_id];

	connection.query(sql, values, function(err, result){
		if (err) {
			console.log(err);
		} else {
			res.send('success');
		}
	});

});

//===============================view user====================================================//

app.post('/view',function(req,res){

	var email = req.body.email;
	console.log(email);

	var sql="select *  from `admin`  WHERE `emailId` !=?";
	var  values=[email];

	connection.query(sql,values,function(err,result){
		console.log(err);
		if(err){
			console.log(err);
		}else{
			res.send(result);
		}
	});

});
	

	
app.post('/view1',function(req,res){

	var email = req.body.email;
	console.log(email);
	var sql="select *  from `user1`  WHERE `emailId` !=?";
	var  values=[email];

	connection.query(sql,values,function(err,result){
		console.log(err);
		if(err){
			console.log(err);
		}else{
				res.send(result);
		}
	});

});
	
//==================================================view task====================================

app.post('/viewtask',function(req,res){

	var sql="select *  from `task` ";
	var values=[];

	connection.query(sql,values,function(err,result){
		console.log(err);
		if(err){
			console.log(err);
		}else{
			res.send(result);
			
		}
	});
});

//========================================home==============================================//

app.post('/home', function(req, res) {	
	res.send("success");
 });


app.post('/uploadImage', upload.single('image'), function(req, res){
	var file = req.file;
	var user_id = req.body.user_id;

	if ( file == undefined ) {
		console.log(err);
	} else {
		var sql = "UPDATE `user1` SET `profile_image`=? WHERE `user_ID`=?";
		connection.query(sql, [file.filename, user_id], function(err, result){
			if (err){
				console.log(err);
			} else {
				var response = {
					status: 1,
					message: "Upload successfully."
				}
				res.send(response);
			}
		});
	}
});
 

 app.post('/uploadImage1', upload.single('image'), function(req, res){
	var file = req.file;
	var user_id = req.body.userid;

	if ( file == undefined ) {
		console.log(err);
	} else {
		var sql = "UPDATE `task` SET `task_desc`=? WHERE `user_ID`=?";
		connection.query(sql, [file.filename, user_id], function(err, result){
			if (err){
				console.log(err);
			} else {
				var response = {
					status: 1,
					message: "Upload successfully."
				}
				res.send(response);
			}
		});
	}
});
//--------------------------------------for the server----------------------------------------------//
app.listen('3001', function(){
	console.log("Server chal rha hai 3001 pr");
});
//------------------------------------------end of the server----------------------------------------//
