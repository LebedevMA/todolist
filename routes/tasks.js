var ObjectID = require('mongodb').ObjectID;

// Обработчики маршрутов работы с задачами
module.exports = function(app, db) {
	// Список задач
	app.get('/tasks', (req, res) => {
		db.collection('tasks').find((err, cursor) => {
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
		var details = { 'priority' : parseInt(req.params.priority, 10) };
		
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
		var completed;
		if (req.params.completed == "true") completed = true;
		if (req.params.completed == "false") completed = false;
		
		var details = { 'completed' : completed };
		
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
		var id = req.params.id;
		
		var details = { '_id': new ObjectID(id) };
		
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
		var task_text = "";
		if (req.body.text !== undefined) task_text = req.body.text;
		var task_priority = 0;
		if (req.body.priority !== undefined) task_priority = parseInt(req.body.priority, 10);
		var task_completed;
		if (req.body.completed == "true") task_completed = true;
		if (req.body.completed == "false") task_completed = false;
		var task = { text: task_text, priority: task_priority, completed: task_completed };
		
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
		var id = req.params.id;
		var details = { '_id': new ObjectID(id) };
		
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
		var id = req.params.id;
		
		var details = { '_id': new ObjectID(id) };
		
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