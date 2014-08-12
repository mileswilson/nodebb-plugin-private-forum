var plugin = {}

plugin.addNavigation = function(header, callback) {
    header.navigation.push({
        class: "",
        iconClass: 'fa fa-fw ' + 'fa-plus',
        "name": "hello",
        "text": "Add Forum",
        "title": "hello world",
        route: "/new_category"
    });
    callback(null, header);
};

plugin.init = function(app, middleware, controllers, callback) {
    app.get('/new_category', middleware.buildHeader, renderAddPage);
    //app.get('/new_category', renderAddPage);
    app.get('/api/new_category', renderAddPage);


    var SocketPlugins = module.parent.require('./socket.io/plugins');
    SocketPlugins.privateForum = {};
    SocketPlugins.privateForum.addForum = function(socket, data, callback) {
        console.log("DID A THING");
        var Categories = module.parent.require('./categories');
        console.log(Categories);
        console.log(data);
        Categories.create({
            name: data['name'],
            order: 1
        }, function(err, result) {
            console.log(err);
            console.log(result);
        });
    };
    callback();
}

function renderAddPage(req, res, next) {
    res.render('add-page', {});
}

module.exports = plugin;