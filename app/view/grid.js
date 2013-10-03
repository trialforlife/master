Ext.define('UsersApp.view.grid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.NamesGridPanel',
    requires: ['Ext.grid.plugin.CellEditing', 'Ext.form.field.*'],
    itemId: 'usersGrid',
    initComponent : function() {
        this.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 2
        });
        this.plugins = this.cellEditing;
        this.columns = this.columnsGet();
        this.tbar    = this.tbarGet();
        this.callParent();

        Ext.define('select_store', {
             extend: 'Ext.data.Model',
             fields: [
                 {name: 'secondName', type: 'string'},
                 {name: 'balance', type: 'float'},
             ]
         });
        if(document.getElementById('deposit_id') != null){
            console.log(document.getElementById('deposit_id').value);
        }
        if(typeof dep_select!='undefined'){
            back_dep_select =  dep_select;         
        }
        else{
            back_dep_select = '';
        }

        select_store = Ext.create('Ext.data.Store', {
            autoSync : true,
             model: 'select_store',
             proxy: {
                 type: 'ajax',
                 api: {
                    read:    'crud.php?act=read',
                    update:  'crud.php?act=update_deposit&back_dep_select='+ back_dep_select,
                    create:  'crud.php?act=create',
                    destroy: 'crud.php?act=delete'
                },
                 //url: 'http://amdevelop.net/testtasks/select.php',
                 reader: {
                     type: 'json',
                     root: 'names'
                 }
             },
             autoLoad: true
         });
    },
    border: false,
    tbarGet: function(){ 

        return[
            {
                text: 'Add',
                itemId: 'addButton',
                iconCls: 'add',
                handler: this._onUserAddClick
            },
            {
                text: 'Remove',
                itemId: 'delButton',
                iconCls: 'delete',
                handler: this._onUserDelClick
            },'->',
            {
                text: 'Deposit',
                itemId: 'star',
                iconCls: 'button',
                handler: this._onUserDepositClick
            },            
            {
                text: 'Transfer',
                itemId: 'star1',
                iconCls: 'star',
                handler: this._onUserTransferClick
            },            
            {
                text: 'Overdraw',
                itemId: 'star2',
                iconCls: 'star',
                handler: this._onUserOverdrawClick
            }/*,'->',{
                text: 'page',
                id: 'webButton',
                iconCls: 'web',
                scope: this,
                handler: function(){ window.open('page.html', '_blank'); }
            }*/
        ]
    },

    emptyFieldRenderer: function(v){if (v == '') return '<span style=\'color: red\'>' + Ext.data.validations.lengthMessage + '</span>'; else return v;},

    columnsGet: function(){

        return [
            {
                text: 'First Name',
                field: 'textfield',
                renderer: this.emptyFieldRenderer,
                allowBlank: false,
                width: 150,
                sortable : true,
                dataIndex: 'firstName'
            },
            {
                text     : 'Second Name',
                allowBlank: false,
                renderer: this.emptyFieldRenderer,
                field: 'textfield',
                flex     : 1,
                sortable : true,
                dataIndex: 'secondName'
            },
            {
                text     : 'Balance($)',
                allowBlank: false,
                renderer: this.emptyFieldRenderer,
                field: 'textfield',
                width     : 150,
                sortable : true,
                dataIndex: 'balance'
            }
            
        ]
    },

    _onUserAddClick: function(button){
        var grid = button.up('NamesGridPanel');
        var r = Ext.ModelManager.create({
            firstName: '',
            secondName: '',
            balance:'',

            id: null
        }, 'UsersApp.model.Names');
        grid.store.insert(0, r);
        grid.cellEditing.startEditByPosition({row: 0, column: 0});
    },

    _onUserDelClick: function(button){
        var grid = button.up('NamesGridPanel');
        grid.store.remove(grid.getSelectionModel().getSelection()[0]);
    },
    _onUserDepositClick: function(button, e){
        Ext.create('Ext.window.Window', {
        title: 'Making deposit',
        height: 200,
        width: 400,
        layout: 'vbox',
        items:[{  // Let's put an empty grid in just to illustrate fit layout
            xtype: 'combobox',
            height: 17,
            fieldLabel: 'Choose   account ',
            width: 360,
            queryMode: 'local',
            valueField: 'secondName',
            tpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                    '<div class="x-boundlist-item">{secondName}</div>',
                '</tpl>'
            ),
            displayTpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                    '{secondName}',
                '</tpl>'
            ),
            store: select_store,
            dataIndex: 'secondName',
            valueField: 'secondName',
            renderer: this.emptyFieldRenderer,
                allowBlank: false,
                listeners: { 
                select: function(combo, records) {
                    dep_select=combo.getValue();
                }}
        }
        ,{  
            width: 360,
            xtype:'textfield',
            dataIndex: 'balance_plus',
            valueField: 'balance_plus',
            id:'balance_plus',
            fieldLabel: 'Money ammount'            
        },
        {
            height: 20,
            width:100,
            xtype:'button',
            text:'Proceed',
            handler: function(){
                balance_plus = (Ext.getCmp('balance_plus').getValue());
                select_store = Ext.create('Ext.data.Store', {
                    autoSync : true,
                     model: 'select_store',
                     proxy: {
                         type: 'ajax',
                         api: {
                            read:    'crud.php?act=read',
                            update:  'crud.php?act=update_deposit&back_dep_select='+ dep_select +'&balance_plus='+ balance_plus,
                            //create:  'crud.php?act=create',
                            //destroy: 'crud.php?act=delete'
                        },
                         //url: 'http://amdevelop.net/testtasks/select.php',
                         reader: {
                             type: 'json',
                             root: 'names'
                         }
                     },
                     autoLoad: true
                 });
                 select_store.update();
                 alert('Recharged successfully on $ '+ balance_plus);

            }
        }]              
        }).show();    
    },
    _onUserTransferClick: function(button, e){
        Ext.create('Ext.window.Window', {
        title: 'Transfering money...',
        height: 200,
        width: 400,
        layout: 'vbox',
        items:[{  // Let's put an empty grid in just to illustrate fit layout
            xtype: 'combobox',
            height: 17,
            fieldLabel: 'Sender  account ',
            width: 360,
            queryMode: 'local',
        
            valueField: 'secondName',
            tpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                    '<div class="x-boundlist-item">{secondName}</div>',
                '</tpl>'
            ),
            displayTpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                    '{secondName}',
                '</tpl>'
            ),
            store: select_store,
            dataIndex: 'secondName',
            listeners: { 
                select: function(combo, records) {
                    dep_select = combo.getValue();
                }}
        },
        {  // Let's put an empty grid in just to illustrate fit layout
            xtype: 'combobox',
            height: 17,
            fieldLabel: 'Recipient account ',
            width: 360,
            queryMode: 'local',
        
            valueField: 'secondName',
            tpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                    '<div class="x-boundlist-item">{secondName}</div>',
                '</tpl>'
            ),
            displayTpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                    '{secondName}',
                '</tpl>'
            ),
            store: select_store,
            dataIndex: 'secondName',
            listeners: { 
                select: function(combo, records) {
                    dep_select_rec=combo.getValue();
                }}
        }
        ,{  width: 360,
            xtype:'textfield',
            dataIndex: 'balance_plus',
            fieldLabel: 'Money ammount',
            id:'balance_plus'            
        },
       
        {
            height: 20,
            width:100,
            xtype:'button',
            text:'Proceed',
            handler: function(){
                if(dep_select == dep_select_rec){
                    alert("You can not tranfer money between only one account")
                }
                else{
                    balance_plus = (Ext.getCmp('balance_plus').getValue());
                    select_store = Ext.create('Ext.data.Store', {
                    autoSync : true,
                     model: 'select_store',
                     proxy: {
                         type: 'ajax',
                         api: {
                            read:    'crud.php?act=read',
                            update:  'crud.php?act=update_transfer&back_dep_select='+ dep_select +'&balance_plus='+ balance_plus+'&back_dep_select_rec='+ dep_select_rec,
                            //create:  'crud.php?act=create',
                            //destroy: 'crud.php?act=delete'
                        },
                         //url: 'http://amdevelop.net/testtasks/select.php',
                         reader: {
                             type: 'json',
                             root: 'names'
                         }
                     },
                     autoLoad: true
                 });
                 select_store.update();
                 alert('$ '+ balance_plus+' successfully tranfered from '+dep_select+' to '+dep_select_rec);

                }

                
                
            }
        }]              
        }).show();    
    },

    _onUserOverdrawClick:function(button, e){
        Ext.create('Ext.window.Window', {
        title: 'Withdrawing money...',
        height: 200,
        width: 400,
        layout: 'vbox',
        items:[{  // Let's put an empty grid in just to illustrate fit layout
            xtype: 'combobox',
            height: 17,
            fieldLabel: 'Choose   account ',
            width: 360,
            queryMode: 'local',
            valueField: 'secondName',
            tpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                    '<div class="x-boundlist-item">{secondName}</div>',
                '</tpl>'
            ),
            displayTpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                    '{secondName}',
                '</tpl>'
            ),
            store: select_store,
            dataIndex: 'secondName',
            listeners: { 
                select: function(combo, records) {
                    dep_select=combo.getValue();
                }}
        },
        
        {   width: 360,
            id:'balance_plus',
            xtype:'textfield',
            dataIndex: 'balance_plus',
            fieldLabel: 'Money ammount'            
        },
        {
            height: 20,
            width:100,
            xtype:'button',
            text:'Proceed',
            handler: function(){
                balance_plus = (Ext.getCmp('balance_plus').getValue());
                select_store = Ext.create('Ext.data.Store', {
                    autoSync : true,
                     model: 'select_store',
                     proxy: {
                         type: 'ajax',
                         api: {
                            read:    'crud.php?act=read',
                            update:  'crud.php?act=update_over&back_dep_select='+ dep_select +'&balance_plus='+ balance_plus,
                            //create:  'crud.php?act=create',
                            //destroy: 'crud.php?act=delete'
                        },
                         //url: 'http://amdevelop.net/testtasks/select.php',
                         reader: {
                             type: 'json',
                             root: 'names'
                         }
                     },
                     autoLoad: true
                 });
                 select_store.update();
                 alert('Withdrawn successfully at $ '+ balance_plus);

            }
        }]              
        }).show();    
    },

})
