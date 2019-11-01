module.exports = function (app) {
    var controller = require('../controller/controller');


    app.route('/register')
        .post(controller.register)
    app.route('/list-all')
        .get(controller.list_all)
    app.route('/login')
        .get(controller.login)
}