sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
],function (Controller, MessageToast, Fragment) {

    "use strict";

    return Controller.extend("logaligroup.com.invoices.controller.HelloPanel",{

        onInit: function () {

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