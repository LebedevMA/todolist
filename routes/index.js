// Обработчики маршрутов работы с задачами
var tasksRoutes = require('./tasks');
// Обработчики маршрутов регистрации и авторизации
var usersRoutes = require('./users');

// Определение обработчиков маршрутов
module.exports = function(app, db) {
	tasksRoutes(app, db);
	usersRoutes(app, db);
};