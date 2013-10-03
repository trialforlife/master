Ext.define('UsersApp.view.win', {
    extend: 'Ext.Window',
    requires: ['UsersApp.view.grid'],
    itemId: 'usersWindow',
    border: true,
    autoScroll: true,
    width: 500, height: 300,
    headerPosition: 'top',
    layout: 'fit',
    items: [
        { xtype: 'NamesGridPanel', itemId: 'NamesGrid' }
    ]
});
