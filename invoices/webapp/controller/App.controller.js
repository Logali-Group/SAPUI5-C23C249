sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],function(Controller, JSONModel){

    "use strict";

    return Controller.extend("logaligroup.com.invoices.controller.App",{

        onInit: function () {
            this._loadModel();
        },

        _loadModel: function () {
            let oData = {
                recipient: {
                    name: "World"
                }
            };
            let oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "view");
        },

        onOpenDialogHeader: function () {
            this.getOwnerComponent().openHelloDialog();
        }

    });
});