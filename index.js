require('dotenv').config();

const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
var morgan = require('morgan');

const route = require('./routes/index');

const app = express();

const sql=require("mssql")


const ports = process.env.PORT || 3000;


const config={
	user:"admin",
	password:"admin",
	server:"DESKTOP-D1R061H",
	database:"bookstore",
	port:1433,
	options:{
		trustServerCertificate:true
	}
}
const appPool = new sql.ConnectionPool(config)
app.use(morgan('common'));

app.use(bodyParser.json());
app.use(cors());
// app.use(function(req, res, next) {
// 	res.header("Access-Control-Allow-Origin", "*");
// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// 	next();
//   });
// route(app)
app.use('/api',route)
appPool.connect().then(function(pool) {
	app.locals.db = pool;
	const server = app.listen(3000, function () {

	  console.log('Example app listening at')
	})
  }).catch(function(err) {
	console.error('Error creating connection pool', err)
  });

  app.use('/images/books',express.static(path.join('images/books')))