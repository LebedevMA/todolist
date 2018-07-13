var ObjectID = require('mongodb').ObjectID;

// Обработчики маршрутов регистрации и авторизации
module.exports = function(app, db) {
	// Регистрация пользователя
	app.post('/users/register', (req, res) => {
		if (req.body.username !== undefined && req.body.password !== undefined){
			var details = { 'username': req.body.username };
			db.collection('users').findOne(details, (err, item) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				if (item === null){
					var user = { username: req.body.username, password: req.body.password, role: 'user' };
					
					db.collection('users').insert(user, (err, result) => {
					if (err) { 
						res.send({ 'error': 'An error has occurred' }); 
					} else {
						req.session.user = {id: result.ops[0]._id, username: result.ops[0].username, role: result.ops[0].role}
						res.send(result.ops[0]);
					}
					});
				}else{
					res.send({'error':'User exists'});
				}
			} 
			});
		}else{
			res.send({'error':'Bad username or password'});
		}
	});
	// Авторизация пользователя
	app.post('/users/login', function(req, res) {
		if (req.session.user) return res.redirect('/tasks')
		var details = { 'username': req.body.username, 'password' : req.body.password};
		db.collection('users').findOne(details, (err, item) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				if (item !== null){
					req.session.user = {id: item._id, username: item.username, role: item.role}
					res.send(req.session.user)
				}else{
					res.send({'error':'Invalid password'});
				}
			} 
		});
	});
	// Деавторизация пользователя
	app.post('/users/logout', function(req, res) {
		if (req.session.user) {
			delete req.session.user;
		}
	});
};