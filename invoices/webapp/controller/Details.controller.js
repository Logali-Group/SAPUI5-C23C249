sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
    "sap/ui/core/UIComponent"
], function(
	Controller, History, UIComponent
) {
	"use strict";

	return Controller.extend("logaligroup.com.invoices.controller.Details", {

		onInit: function () {
			let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.getRoute("Details").attachPatternMatched(this._onObjectMatched, this);
		},

		_onObjectMatched: function (oEvent) {
			let oArgs = oEvent.getParameter("arguments"),
				sPath = oArgs.invoicePath,
				sDecode = window.decodeURIComponent(sPath);

			let oView = this.getView();

			oView.bindElement({
				path:sDecode,
				model: 'northwind'
			});
		},

		onNavToBack: function () {
            let oHistory = History.getInstance(),
                sPreviousHash = oHistory.getPreviousHash();

            if (sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                let oRouter = UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteApp");
            }
        }

	});
});