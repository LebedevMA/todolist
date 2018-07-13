// Обработчики маршрутов работы с задачами
var tasksRoutes = require('./tasks');
// Обработчики маршрутов регистрации и авторизации
var usersRoutes = require('./users');

// Определение обработчиков маршрутов
module.exports = function(app, db) {
	// Если пользователь авторизован, перенаправляет на работу с задачами
	// Иначе перенаправляет на страницу авторизации
	app.all('/', function(req, res) {
		if (req.session.user) {
			res.redirect('/tasks');
		}else{
			res.redirect('/users/login');
		}
	});
	tasksRoutes(app, db);
	usersRoutes(app, db);
};