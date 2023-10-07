sap.ui.define([
	"sap/ui/base/ManagedObject",
    "sap/ui/core/Fragment"
], function( ManagedObject, Fragment) {
	"use strict";

	return ManagedObject.extend("logaligroup.com.invoices.controller.HelloDialog", {

        constructor: function(oView) {
            this._oView = oView;
        },

        exit: function () {
            delete this._oView;
        },

        open: function () {
            let oView = this._oView;

            let oFragmentController = {
                onCloseDialog: function () {
                    oView.byId("helloDialog").close();
                }
            };

            if (!this._pDialog) {
                console.log("Primera vez: Voy a cargar el fragmento");
                this._pDialog = Fragment.load({
                    id: oView.getId(),
                    name: "logaligroup.com.invoices.fragment.HelloDialog",
                    controller: oFragmentController
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }

            this._pDialog.then(function (oDialog) {
                console.log("Ya estoy cargado");
                oDialog.open();
            });
        }

	});
});