<div class="row">
    <div class="col-md-9 col-xs-12" no-widget-class="col-lg-12 col-xs-12" no-widget-target="sidebar">
        <!-- <div widget-area="content"> -->
        <div id="addForum">
            <div class="well">
                
                <form class="private-forum-form">
                    <span class="pull-right"><i class="fa fa-times pointer"></i></span>
                    <label>Name of private forum
                        <input type="text" class="form-control" name="name" />
                    </label>
                </form>
            
                            <div id="category-permissions-modal"  tabindex="-1" role="dialog" aria-labelledby="Category Permissions" aria-hidden="true">
      
                    <h3>Users</h3>

                <div class="">
                    <p>The following users have access to your Category</p>
                    <ul class="members userlist"></ul>

                    <hr />
                    <form role="form">
                        <div class="form-group">
                            <label for="permission-search">User Search</label>
                            <input class="form-control" type="text" id="permission-search" />
                        </div>
                    </form>
                    <ul class="search-results users userlist"></ul>
                </div>

            </div>


            </div>


            <button class="btn btn-lg btn-success" id="add">Add New Forum</button>
            
        </div>
        <!--  </div> -->
    </div>
</div>
<script>
$('#add').on('click', function(ev) {
    console.log("CLICKETY SPIT");
    var arr = [];
    $('#addForum .well .private-forum-form').each(function() {
        var data = $(this).serializeArray();
        if (data[0].value) {
            arr = {
                name: data[0].value,
                selectedUsers: selectedUsers
            };
        }
    });
    $.get('/api/add_private_forum', arr, arr, function(err,results) {
        if(err){
            app.alertError(err.message);
        }
        else {
            app.alertSuccess("Forum added");
        }
    });
});


var selectedUsers = [];

var modal = $('#category-permissions-modal'),
    searchEl = modal.find('#permission-search'),
    resultsEl = modal.find('.search-results.users'),
    searchDelay;

    searchEl.off().on('keyup', function() {
        var searchEl = this,
            liEl;

        clearTimeout(searchDelay);

        searchDelay = setTimeout(function() {
            socket.emit('plugins.privateForum.findUser', {
                username: searchEl.value,
            }, function(err, results) {
                if(err) {
                    console.log(err)
                    return app.alertError(err.message);
                }
                console.log(results);
                templates.parse('partials/users', {
                    users: results
                }, function(html) {
                    resultsEl.html(html);
                    $(".userlist .listitem .btn-primary").on('click', function() {
                        var listItem = $(this).parent().parent();

                        $(".members").append(listItem)
                        selectedUsers.push(listItem.data('uid'))
                        $(this).removeClass('btn-primary').addClass('btn-success').text("Added");
                  
                    })
                });
            });
        }, 250);
    });

</script>