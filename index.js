const express =require("express");
const app= express();
require('dotenv').config();

const dgram = require('dgram');
const socket = dgram.createSocket('udp4');

const mysql = require('mysql');
const { timeStamp } = require("console");


app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3010);


const connection = mysql.createConnection({
	host: process.env.HOST,
	database: process.env.DB,
	user: process.env.USER,
	password: process.env.PASS
});


socket.on('message', function(msg, rinfo){
    console.log(msg)  
    Latitud = msg.toString().split(' ')[0];
	Longitud = msg.toString().split(' ')[1];
    timestamp = msg.toString().split(' ')[2];

    connection.query('INSERT INTO tabla (Latitud, Longitud, timestamp) VALUES ("'+Lat+'","'+Lng+'","'+ts+'",)', function(error){
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
    connection.query(`SELECT * FROM tabla WHERE Id = (SELECT MAX(Id) FROM tabla)`, function(error, data){
        if(error){
            console.log(error);
            res.status(500)
        }else{
            console.log(data);
            res.send(data[0]);
        }
    });

});
    



app.listen(app.get('port'), function(){
	console.log("Server listening in port: ", app.get('port'));
});