sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],function (Controller, JSONModel) {

    "use strict";

    return Controller.extend("employees.controller.Main",{

        onInit: function () {
            let oEmployees = new JSONModel(),
                oCountries = new JSONModel(),
                oConfig =   new JSONModel(),
                oLayout =   new JSONModel(),
                oView =     this.getView();

            //Variable autodeclarada - Global
            this.that = this;
            let $this = this;

            //Variable global para el modelo ysapui5
            this._oYSAPUI5 = this.getOwnerComponent().getModel("ysapui5");

            //load Employees.json
            oEmployees.loadData("../model/Employees.json");
            oView.setModel(oEmployees, "jsonEmployees");

            //load Countries.json
            oCountries.loadData("../model/Countries.json");
            oView.setModel(oCountries, "jsonCountries");

            //load Config.json
            oConfig.loadData("../model/Config.json");
            oView.setModel(oConfig, "jsonConfig");

            //load Layout.json
            oLayout.loadData("../model/Layout.json");
            oView.setModel(oLayout, "jsonLayout");

            //Todo campo que sea declaro como decimal en SAP, debe ser enviado como un String y el separador obligatoriamente debe ser un punto "."

            this._oEventBus = sap.ui.getCore().getEventBus();
            this._oEventBus.subscribe("flexible","showDetails", this.showEmployeeDetails.bind(this));
        },

        showEmployeeDetails: function (sChanne, sEventName, sPath) {

            let oDetailsView = this.getView().byId("detailsEmployeeView");
                oDetailsView.bindElement("odataNorthwind>"+sPath);
            this.getView().getModel("jsonLayout").setProperty("/ActiveKey","TwoColumnsMidExpanded");

            let oIncidence = new JSONModel([]);
            oDetailsView.setModel(oIncidence, "incidenceModel");
            oDetailsView.byId("tableIncidence").removeAllContent();
        }

    });
});