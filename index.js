require('dotenv').config();

const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
var morgan = require('morgan');

const authRoute = require('./routes/authRoute');
const bookRoute = require('./routes/bookRoute');
const userRoute = require('./routes/userRoute');
const auth = require('./middleware/auth');
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
app.use('/api',authRoute)
app.use('/api',bookRoute)

appPool.connect().then(function(pool) {
	app.locals.db = pool;
	const server = app.listen(3000, function () {

	  console.log('Example app listening at')
	})
  }).catch(function(err) {
	console.error('Error creating connection pool', err)
  });