const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sql = require('mssql');

class AuthController {
	async login(req, res) {
		const pool=req.app.locals.db
		await pool.request().input('email',sql.VarChar,req.body.email)
		.query('SELECT * FROM [User] where email=@email ', function(err, recordset) {
			if (err) {
			  console.error(err)
			  res.status(200).send('SERVER ERROR')
			  return;
			}
			// if(recordset.)
			const user=recordset.recordset[0];
			if(!user){
				res.status(500).json({code:500,message:"Email isn't exist!"});
				return;
			}
			if(user.password === req.body.password){
				const token = jwt.sign(
					{ id: user.id,
						email:user.email,
						role: user.role_id },
					process.env.TOKEN_KEY,
					{
						expiresIn: '2h',
					}
				);
				res.status(200).json({code:200, message: 'login successfully',token:token,user:{id:user.id,email:user.email,name:user.fullname,role:user.role_id} });
				return;
			}
			res.status(500).json({code:500,message:"Password is invalid"})
			return;
		  })
	}
	async register(req, res) {
		const pool=req.app.locals.db
		try {
			await pool.request().input('email',sql.VarChar,req.body.email)
		.query('SELECT * FROM [User] where email=@email ', function(err, recordset) {
			if (err) {
			  console.error(err)
			  res.status(500).send('SERVER ERROR')
			  return;
			}
			// if(recordset.)
			const user=recordset.recordset[0];
			if(!!user){
				res.status(500).json("Email already exists");
				return;
			}
			console.log(req.body.sex=='male');
			if(req.body.sex !=='female' && req.body.sex!=='male') return res.status(500).json({message:"register failed!"});
			 if(!req.body.role_id || req.body.role_id!=2)req.body.role_id=1;
			const query=`INSERT INTO [User] ([fullname],[sex],[DOB],[email],[phone_number],[address],[password],[role_id]) VALUES
							(N'${req.body.fullname}','${req.body.sex}','${req.body.dob}',N'${req.body.email}',N'${req.body.phone_number}',N'${req.body.address}',N'${req.body.password}',${req.body.role_id});`
				pool.query(query,(err,result)=>{
					try{
						if(err) res.status(500).json("Cant't register user!");
						console.log(result)
						return res.status(200).json({code:200,message:"Register successfully!"})
						}catch(e){
							console.log(e);
						}
					}
				)
		  })
		} catch (err) {
			console.log(err);
			return res.status(500).json('Can not create user');
		}
	}
}

module.exports = new AuthController();
