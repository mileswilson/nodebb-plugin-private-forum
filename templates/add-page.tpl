<div class="row">
    <div class="col-md-9 col-xs-12" no-widget-class="col-lg-12 col-xs-12" no-widget-target="sidebar">
        <!-- <div widget-area="content"> -->
        <div id="addForum">
            <div class="well">
                
                <form>
                    <span class="pull-right"><i class="fa fa-times pointer"></i></span>
                    <label>Name of private forum
                        <input type="text" class="form-control" name="name" />
                    </label>
                </form>
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
    $('#addForum .well form').each(function() {
        var data = $(this).serializeArray();
        if (data[0].value) {
            arr = {
                name: data[0].value
            };
        }
    });
    socket.emit('plugins.privateForum.addForum', arr, function() {
        app.alertSuccess('Saved custom pages - please restart your forum to activate the new routes.');
    });
});
</script>