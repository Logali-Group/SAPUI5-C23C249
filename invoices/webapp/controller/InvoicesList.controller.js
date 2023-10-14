sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "logaligroup/com/invoices/model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],function (Controller, JSONModel, formatter, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("logaligroup.com.invoices.controller.InvoicesList",{

        invoicesFormatter: formatter,

        onInit: function () {
            let oModel = new JSONModel();
                oModel.loadData("../model/Currencies.json");
            this.getView().setModel(oModel, "currency");
        },

        onFilterInvoices: function (oEvent) {
            // let oSource = oEvent.getSource();
            // console.log(oSource);
            let oParameters = oEvent.getParameters();

            let sValue = oEvent.getParameter("newValue");
            // sValue2 = oEvent.getParameters().newValue;

            let aFilter = [];

            if (sValue) {
                aFilter.push(new Filter("ProductName", FilterOperator.EQ, sValue));
            }

            let oList = this.getView().byId("invoiceList"),
                oBinding = oList.getBinding("items");
                oBinding.filter(aFilter);

        }

    });
});