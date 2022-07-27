require('dotenv').config();

const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
var morgan = require('morgan');

const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const auth = require('./middleware/auth');
const app = express();

const sql=require("mssql")


const ports = process.env.PORT || 3000;


const config={
	user:"sa1",
	password:"@quang12345",
	server:"DESKTOP-2MKRUML\\KLIGHT",
	database:"master",
	port:1433,
	options:{
		trustServerCertificate:true
	}
}

app.use(morgan('common'));

app.use(bodyParser.json());
app.use(cors());

app.use('/',async (req,res)=>{
	try{
		await sql.connect(config);
		console.log("connect success")
		res.send("db connected");
	}catch(err){
		console.log(err)
	}
})
app.use('/images', express.static(path.join('images')));


app.listen(ports,()=>{
	console.log("run port")
})
// app.use('/api/users', auth, userRoute);
// app.use('/api/auth', authRoute);
