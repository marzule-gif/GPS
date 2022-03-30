const express =require("express");
const app= express();
require('dotenv').config();

const dgram = require('dgram');
const socket = dgram.createSocket('udp4');

const mysql = require('mysql');


app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3010);




const connection = mysql.createConnection({
	host: process.env.HOST,
	database: process.env.DB,
	user: process.env.USER,
	password: process.env.PASS,
    insecureAuth :false
});

connection.connect(function(err){
    if(err){
      console.log(err);
    }else{
      console.log("Connection created!");
    }
  })



socket.on('message', function(msg, rinfo){
    console.log(msg)  
    Latitud = msg.toString().split(' ')[0];
	Longitud = msg.toString().split(' ')[1];
    timestamp = msg.toString().split(' ')[2];

    connection.query('INSERT INTO tabla (Latitud, Longitud, timestamp) VALUES ("'+Latitud+'","'+Longitud+'","'+timestamp+'",)', function(error){
		if(error){
			console.log("An error has occured: ", error)
		}
	});
})
socket.bind(3000)



app.get('/', function(req, res){
    
   res.render('index');
});


app.get('/consulta', function(req, res){
    connection.query(`SELECT * FROM Datos WHERE Id = (SELECT MAX(Id) FROM Datos)`, function(error, data){
        if(error){
            console.log(error);
            res.status(500)
        }else{
            console.log(data);
            res.send(data[0]);
        }
    });

});

app.get('/history', function(req, res){
  const data1 = req.body.data1;
  const data2 =req.body.data2; 
  connection.query(`SELECT * FROM Datos WHERE timestamp BETWEEN ${data1} AND ${data2})`, function(error, data){
      if(error){
          console.log(error);
          res.status(500)
      }else{
          console.log(data);
          res.send(data);
      }
  });

});



app.listen(app.get('port'), function(){
	console.log("Server listening in port: ", app.get('port'));
});