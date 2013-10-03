Ext.define('UsersApp.store.store', {
    extend: 'Ext.data.Store',

    requires  : ['UsersApp.model.Names', 'Ext.data.proxy.Ajax'],
    model: 'UsersApp.model.Names',

    autoSync: false,
    autoLoad: false,
    sorters: [
        {
            property : 'firstName',
            direction: 'ASC'
        }
    ],
    proxy: {
        type: 'ajax',
        api: {
            read:    'crud.php?act=read',
            update:  'crud.php?act=update',
            create:  'crud.php?act=create',
            destroy: 'crud.php?act=delete'
        },

        reader: {
            type: 'json',
            root: 'names',
            idProperty: 'id'
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            root: 'names'
        }
    }
});
