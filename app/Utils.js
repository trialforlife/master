Ext.define('UsersApp.Utils', {
    statics: {
        log: function(msg){
            Ext.DomHelper.append('console', '> '+ msg + '<br />');
        },
        ping: function(conf, scope){
            Ext.Ajax.request({
                url: 'online',
                method: 'GET',
                success: function(response){
                    if (conf && conf.success)
                        if (scope) conf.success.call(scope);
                        else conf.success()
                },
                failure: function(){
                    if (conf && conf.failure)
                        if (scope) conf.failure.call(scope);
                        else conf.failure();
                }
            });
        }
    }
});
