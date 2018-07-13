var ObjectID = require('mongodb').ObjectID;

// Обработчики маршрутов работы с задачами
module.exports = function(app, db) {
	// Список задач
	app.get('/tasks', (req, res) => {
		if (req.session.user === undefined){
			res.send({'error' : 'Login required'});
			return;
		}
		var details;
		switch(req.session.user.role){
		case 'admin':
			details = { };
			break;
		case 'user':
			details = { 'user' : new ObjectID(req.session.user.id) };
			break;
		}
		
		db.collection('tasks').find(details, (err, cursor) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				cursor.toArray((err, result) => {
					if (err) {
						res.send({'error':'An error has occurred'});
					} else {
						res.send(result);
					} 
				})
			} 
		});
	});
	// Фильтрация по приоритету
	app.get('/tasks/priority/:priority', (req, res) => {
		if (req.session.user === undefined){
			res.send({'error' : 'Login required'});
			return;
		}
		var details;
		switch(req.session.user.role){
		case 'admin':
			details = { 'priority' : parseInt(req.params.priority, 10) };
			break;
		case 'user':
			details = { 'priority' : parseInt(req.params.priority, 10), 'user' : new ObjectID(req.session.user.id) };
			break;
		}
		
		db.collection('tasks').find(details, (err, cursor) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				cursor.toArray((err, result) => {
					if (err) {
						res.send({'error':'An error has occurred'});
					} else {
						res.send(result);
					} 
				})
			} 
		});
	});
	// Фильтрация по статусу выполнения
	app.get('/tasks/completed/:completed', (req, res) => {
		if (req.session.user === undefined){
			res.send({'error' : 'Login required'});
			return;
		}
		var completed;
		if (req.params.completed == "true") completed = true;
		if (req.params.completed == "false") completed = false;
		
		var details;
		switch(req.session.user.role){
		case 'admin':
			details = { 'completed' : completed };
			break;
		case 'user':
			details = { 'completed' : completed, 'user' : new ObjectID(req.session.user.id) };
			break;
		}
		
		db.collection('tasks').find(details, (err, cursor) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				cursor.toArray((err, result) => {
					if (err) {
						res.send({'error':'An error has occurred'});
					} else {
						res.send(result);
					} 
				})
			} 
		});
	});
	// Отдельная задача
	app.get('/tasks/:id', (req, res) => {
		if (req.session.user === undefined){
			res.send({'error' : 'Login required'});
			return;
		}
		var id = req.params.id;
		
		var details;
		
		switch(req.session.user.role){
		case 'admin':
			details = { '_id': new ObjectID(id) };
			break;
		case 'user':
			details = { '_id': new ObjectID(id), 'user' : new ObjectID(req.session.user.id) };
			break;
		}
		
		db.collection('tasks').findOne(details, (err, item) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				res.send(item);
			} 
		});
	});
	// Добавление задачи
	app.post('/tasks', (req, res) => {
		if (req.session.user === undefined){
			res.send({'error' : 'Login required'});
			return;
		}
		var task_text = "";
		if (req.body.text !== undefined) task_text = req.body.text;
		var task_priority = 0;
		if (req.body.priority !== undefined) task_priority = parseInt(req.body.priority, 10);
		var task_completed;
		if (req.body.completed == "true") task_completed = true;
		if (req.body.completed == "false") task_completed = false;
		var task = { text: task_text, priority: task_priority, completed: task_completed, user: new ObjectID(req.session.user.id) };
		
		db.collection('tasks').insert(task, (err, result) => {
			if (err) { 
				res.send({ 'error': 'An error has occurred' }); 
			} else {
				res.send({ 'insertedCount' : result.insertedCount, 'insertedIds' : result.insertedIds });
			}
		});
	});
	// Удаление задачи
	app.delete('/tasks/:id', (req, res) => {
		if (req.session.user === undefined){
			res.send({'error' : 'Login required'});
			return;
		}
		var id = req.params.id;
		var details;
		
		switch(req.session.user.role){
		case 'admin':
			details = { '_id': new ObjectID(id) };
			break;
		case 'user':
			details = { '_id': new ObjectID(id), 'user' : new ObjectID(req.session.user.id) };
			break;
		}
		db.collection('tasks').remove(details, (err, item) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				res.send({'result' : 'success'});
			} 
		});
	});
	// Изменение задачи
	app.put ('/tasks/:id', (req, res) => {
		if (req.session.user === undefined){
			res.send({'error' : 'Login required'});
			return;
		}
		var id = req.params.id;var details;
		
		switch(req.session.user.role){
		case 'admin':
			details = { '_id': new ObjectID(id) };
			break;
		case 'user':
			details = { '_id': new ObjectID(id), 'user' : new ObjectID(req.session.user.id) };
			break;
		}
		
		var task_fields = {};
		if (req.body.text !== undefined) task_fields.text = req.body.text;
		if (req.body.priority !== undefined) task_fields.priority = parseInt(req.body.priority, 10);
		if (req.body.completed !== undefined){
			if (req.body.completed == "true") task_fields.completed = true;
			if (req.body.completed == "false") task_fields.completed = false;
		}
		
		var task_update = { $set : task_fields };
		db.collection('tasks').update(details, task_update, (err, result) => {
			if (err) {
				res.send({'error':'An error has occurred'});
			} else {
				res.send(result);
			} 
		});
	});
};