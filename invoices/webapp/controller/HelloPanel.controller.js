sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
],function (Controller, MessageToast, Fragment) {

    "use strict";

    return Controller.extend("logaligroup.com.invoices.controller.HelloPanel",{

        onInit: function () {
            let oModeli18n = this.getOwnerComponent().getModel("i18n").getResourceBundle();
            let sSepartor = oModeli18n.getText("separator1");
            console.log(sSepartor);

        },

        onShowHello: function () {
            MessageToast.show("Hello World",{
                width: '20rem',
                duration: 5000
            });
        },

        onOpenDialog: function () {
            this.getOwnerComponent().openHelloDialog();
        }

    });

});