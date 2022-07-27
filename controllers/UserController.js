const User = require('../models/User');
const bcrypt = require('bcrypt');
class UserController {
	async update(req, res) {
		console.log(req.file);
		if (
			req.user.userId === req.params.id ||
			req.user.isAdmin
		) {
			console.log(req.body);
			if (req.body.oldPassword) {
				try {
					const user = await User.findById(req.params.id);
					const validPassword = await bcrypt.compare(
						req.body.oldPassword,
						user.password
					);
					if (!validPassword)
						return res.status(400).json('wrong password');
					const salt = await bcrypt.genSalt(10);
					req.body.newPassword = await bcrypt.hash(
						req.body.newPassword,
						salt
					);
				} catch (err) {
					return res.status(500).json(err);
				}
			}
			try {
				const image =
					'http://localhost:3000/images/' +
					req.file.filename; // Note: set path dynamically
				console.log('this is image', image);
				const user = await User.findByIdAndUpdate(
					req.params.id,
					{
						username: req.body.username,
						password: req.body.newPassword,
						email: req.body.email,
						image: image,
					},
					{ new: true }
				);
				return res
					.status(200)
					.json('Account has been updated');
			} catch (err) {
				return res.status(500).json(err);
			}
		} else {
			return res
				.status(403)
				.json('You can update only your account!');
		}
	}
	async delete(req, res) {
		if (
			req.user.userId === req.params.id ||
			req.user.isAdmin
		) {
			try {
				await User.deleteOne({ _id: req.params.id });
				return res
					.status(200)
					.json('Account has been deleted');
			} catch (err) {
				return res.status(500).json(err);
			}
		} else {
			return res
				.status(403)
				.json('You can update only your account!');
		}
	}
	async find(req, res) {
		try {
			const user = await User.findOne({
				_id: req.params.id,
			});
			res.status(200).json(user);
			console.log({ user });
		} catch (err) {
			return res.status(500).json(err);
		}
	}
	async findAll(req, res) {
		console.log('fnd all');
		try {
			const users = await User.find({});
			console.log({ users });
			return res.status(200).json(users);
		} catch (err) {
			return res.status(500).json(err);
		}
	}
}

module.exports = new UserController();
