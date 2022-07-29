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
			  res.status(500).send('SERVER ERROR')
			  return;
			}
			// if(recordset.)
			const user=recordset.recordset[0];
			if(!user){
				console.log(user);
				res.status(500).json("Email isn't exist!");
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
				res.status(200).json({ message: 'success',token:token,user:{id:user.id,email:user.email,name:user.fullname,role:user.role_id} });
				return;
			}
			console.log(user);
			res.status(500).json({message:"Password is invalid"})
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
			 if(!req.body.role_id || req.body.role_id!=2)req.body.role_id=1;
			const query=`INSERT INTO [User] ([fullname],[DOB],[email],[phone_number],[address],[password],[role_id]) VALUES
							(N'${req.body.fullname}','${req.body.DOB}',N'${req.body.email}',N'${req.body.phone_number}',N'${req.body.address}',N'${req.body.password}',${req.body.role_id});`
							console.log(query);
				pool.query(query,(err,result)=>{
					try{
						if(err) console.log(err);
						console.log(result)
						
						return res.status(200).json({result})
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
