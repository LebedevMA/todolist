// Обработчики маршрутов работы с задачами
var tasksRoutes = require('./tasks');

// Определение обработчиков маршрутов
module.exports = function(app, db) {
	tasksRoutes(app, db);
};