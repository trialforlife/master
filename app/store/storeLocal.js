Ext.define('UsersApp.store.storeLocal', {
    extend: 'Ext.data.Store',
    requires  : ['UsersApp.model.Names', 'Ext.data.proxy.LocalStorage'],
    model: "UsersApp.model.Names",

    autoSync: true,
    autoLoad: false,
    sorters: [
        {
            property : 'firstName',
            direction: 'ASC'
        }
    ],
    proxy: {
        type: 'localstorage',
        id  : 'Names'
    }
});
