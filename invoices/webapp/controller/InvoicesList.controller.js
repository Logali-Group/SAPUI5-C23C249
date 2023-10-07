sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("logaligroup.com.invoices.controller.InvoicesList",{

        onInit: function () {
            let oModel = new JSONModel();
                oModel.loadData("../model/Currencies.json");
            this.getView().setModel(oModel, "currency");
        }

    });
});