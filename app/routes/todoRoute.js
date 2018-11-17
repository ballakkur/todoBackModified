const appConfig = require('../../Config/appConfig');
const todoController = require('./../controllers/todoController');
const authMiddleware = require('./../middlewares/authMiddleware');



let baseUrl = `${appConfig.apiVersion}/todo`;
module.exports.setRouter = (app) => {
    
    app.post(`${baseUrl}/create`,authMiddleware.isAuthorized,todoController.createTodo);
    app.post(`${baseUrl}/createPublic`,authMiddleware.isAuthorized,todoController.createPublicTodo);
    app.post(`${baseUrl}/addItem`,authMiddleware.isAuthorized,todoController.addItem);
    app.post(`${baseUrl}/addSubItem`,authMiddleware.isAuthorized,todoController.addSubItem);
    app.post(`${baseUrl}/delete`,authMiddleware.isAuthorized,todoController.deleteTodo);
    app.post(`${baseUrl}/deleteItem`,authMiddleware.isAuthorized,todoController.deleteItem);
    app.post(`${baseUrl}/deleteSubItem`,authMiddleware.isAuthorized,todoController.deleteSubItem);
    app.post(`${baseUrl}/markItem`,authMiddleware.isAuthorized,todoController.markItem);
    app.post(`${baseUrl}/editItem`,authMiddleware.isAuthorized,todoController.editItem);
    app.get(`${baseUrl}/:isPrivate/:creatorId/getList`,authMiddleware.isAuthorized,todoController.getList);
    app.get(`${baseUrl}/getAllItem`,authMiddleware.isAuthorized,todoController.getAllItems);
    app.get(`${baseUrl}/getAllSubItem`,authMiddleware.isAuthorized,todoController.getAllSubItems);
    app.get(`${baseUrl}/getItem/:id`,authMiddleware.isAuthorized,todoController.getItem);
    app.get(`${baseUrl}/:concernId/notification`,authMiddleware.isAuthorized,todoController.loadNotification)
    

}

