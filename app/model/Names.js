Ext.define('UsersApp.model.Names', {
    fields: [{name: 'id',  type: 'int', useNull: true}, {name: 'firstName'}, {name: 'balance'}, {name: 'secondName'}],
    extend: 'Ext.data.Model',

    validations: [{
            type: 'length',
            field: 'firstName',
            min: 1
        },{
            type: 'length',
            field: 'balance',
            min: 1
        },{
            type: 'length',
            field: 'secondName',
            min: 1
        }
    ]
});
