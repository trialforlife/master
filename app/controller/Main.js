Ext.define("UsersApp.controller.Main", {
    extend: 'Ext.app.Controller',
    requires: ['UsersApp.Utils', 'UsersApp.store.storeLocal', 'UsersApp.store.store'],
    
    init: function(){
		var storeLocal = this.getStore("storeLocal");
        var store      = this.getStore("store");
        storeLocal.addListener('load', function(){
            UsersApp.Utils.ping({
                success: this._onPingSuccess,
                failure: this._onPingFailure
            }, this);
        }, this);

        storeLocal.load();
    },


    _onPingSuccess: function(){
        var win        = Ext.ComponentQuery.query('#usersWindow')[0];
        var storeLocal = this.getStore('storeLocal');
        var store      = this.getStore('store');
        var grid       = win.getComponent('NamesGrid');

        UsersApp.Utils.log('Connected successfully to database');
        win.setTitle("Information on clients` accounts")
        localCnt = storeLocal.getCount();
        
        if (localCnt > 0){
            for (i = 0; i < localCnt; i++){
                var localRecord = storeLocal.getAt(i);
                var deletedId   = localRecord.data.id;
                delete localRecord.data.id;
                store.add(localRecord.data);
                localRecord.data.id = deletedId;
            }
            store.sync();
            for (i = 0; i < localCnt; i++){
                storeLocal.removeAt(0);
            }
            //UsersApp.Utils.log('');
        } else {
            //UsersApp.Utils.log('');
        }
            
        store.load();
        grid.reconfigure(store);
        grid.store.autoSync = true;
        grid.store.addListener({
            write: function(){UsersApp.Utils.log('Data saved successfully');}
        });
    },
    _onPingFailure: function(){
        var win        = Ext.ComponentQuery.query('#usersWindow')[0];
        var storeLocal = this.getStore('storeLocal');
        var store      = this.getStore('store');
        var grid       = win.getComponent('NamesGrid');

        win.setTitle("Information on clients` accounts, offline")
        UsersApp.Utils.log('no interent connection');
        UsersApp.Utils.log('working with Localstorage');
        grid.reconfigure(storeLocal);
        grid.store.autoSync = true;
        grid.store.addListener({
            write: function(s, o){
                UsersApp.Utils.log('Data saved successfully');
                var c = o.records.length;
                for (i = 0; i<c; i++){
                    o.records[i].commit()
                }
            }
        });
    }

});
