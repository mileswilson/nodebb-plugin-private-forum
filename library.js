var plugin = {}
var User = module.parent.require('./user'),
    Groups = module.parent.require('./groups'),
    emitter = module.parent.require('./emitter');

var privileges = ['find','read','topics:create','topics:reply'];


plugin.addNavigation = function(header, callback) {
    console.log("header getting uid: "+header.uid);
    User.getUserField(header.uid, 'gold_member', function(err,value) {
        if(value == 'active'){
            header.navigation.push({
                class: "",
                iconClass: 'fa fa-fw ' + 'fa-plus',
                "name": "hello",
                "text": "Add Forum",
                "title": "hello world",
                route: "/new_category"
            });
        }
        callback(null, header);
    });
}


plugin.setGoldMember = function(userData, callback) {
    callback(null, {
        gold_member: userData.gold_member
    });
};

function addGoldStatus(req,res, next) {
    User.isAdministrator(req.user.uid, function(err,result) {
        if(result) {
                console.log("detected an admin");
                console.log(req.query.user_id);
                if(req.query.user_id) {
                    User.setUserField(req.query.user_id, 'gold_member', 'active', 
                        function(err,result) {
                            console.log(err);
                            console.log(result);
                    });
                }
        }

        console.log(result);

    });


}

function addForum(req,res,next) {
    var Categories = module.parent.require('./categories');
        console.log(req.query);
        Categories.create({
            name: req.query['name'],
            order: 1
        }, function(err, result) {
            console.log(err);
            console.log(result);

            //Add the current User to the list of selected Users
            req.query['selectedUsers'].push(req.user.uid);

            for (var i = req.query['selectedUsers'].length - 1; i >= 0; i--) {
                console.log('Adding user:'+req.query['selectedUsers'][i])
                for (var j = 0; j < privileges.length; j++) {
                    console.log("Adding perm to user and cat: "+
                        privileges[j]+" : "+
                        req.query['selectedUsers'][i]+" : "+
                        result.cid);

                    Groups.join("cid:"+result.cid+":privileges:"+privileges[j], req.query['selectedUsers'][i], 
                     function(err,result) {
                        console.log(err);
                        console.log(result);
                        console.log("MADEIT");
                     });
                };
                
            };
            Groups.join("cid:"+result.cid+":privileges:mods", req.user.uid, 
                     function(err,result) {
                        console.log(err);
                        console.log(result);
                        console.log("MADEIT");
                     });
            res.send("OK");
        });
}

plugin.init = function(app, middleware, controllers, callback) {
    app.get('/new_category', middleware.buildHeader, renderAddPage);
    //app.get('/new_category', renderAddPage);
    app.get('/api/new_category', renderAddPage);
    app.get('/api/promote_to_gold', addGoldStatus)
    app.get('/api/add_private_forum', addForum)
    

    var SocketPlugins = module.parent.require('./socket.io/plugins');
    SocketPlugins.privateForum = {};
    SocketPlugins.privateForum.addForum = function(socket, data, callback) {
        
    };

    SocketPlugins.privateForum.findUser = findUsers;
    callback();
}

findUsers = function(socket, data, callback) {
    console.log(data['username'])
    if(!data) {
        return callback(new Error('[[error:invalid-data]]'));
    }

    var username = data.username;

    User.search(username, function(err, data) {
            if (err) {
                return callback(err);
            }
            console.log(data);

            return callback(null,data.users)
        }, callback);
}

function renderAddPage(req, res, next) {
    res.render('add-page', {});
}

module.exports = plugin;