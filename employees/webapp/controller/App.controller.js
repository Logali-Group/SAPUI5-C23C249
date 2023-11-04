sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("employees.controller.App", {

            onInit: function () {
                this._loadEmployees();
                this._loadCountries();
                this._loadConfig();
            },

            _loadEmployees: function () {

                let oView = this.getView();

                let oModel = new JSONModel();
                    oModel.loadData("../model/Employees.json");
                    oView.setModel(oModel, "jsonEmployees");
            },

            _loadCountries: function () {
                let oView = this.getView();

                let oModel = new JSONModel();
                    oModel.loadData("../model/Countries.json");
                    oView.setModel(oModel, "jsonCountries");
            },

            _loadConfig: function () {
                let oView = this.getView();

                let oModel = new JSONModel();
                    oModel.loadData("../model/Config.json");
                    oView.setModel(oModel, "jsonConfig");
            },

            onValidate: function (oEvent) {
                let oInput = oEvent.getSource(),
                    oParameters = oEvent.getParameters(), 
                    sValue = oParameters.value;

                if (sValue.length === 6) {
                    //oInput.setDescription("OK");
                    //this.byId("countries").setVisible(true);
                } else {
                    //oInput.setDescription("Not Ok");
                   //this.byId("countries").setVisible(false);
                }
            },

            onFilter: function () {

                // let oInput = this.byId("slCountry"),
                //     oSelect = this.byId("countries");
                // let sName = oInput.getValue(),
                //     sCountry = oSelect.getSelectedKey();

                let oViewModel = this.getView().getModel("jsonCountries");
                let sName = oViewModel.getProperty("/EmployeeId"),
                    sCountry = oViewModel.getProperty("/CountryKey");

                let aFilter = [];

                if (sName) {
                    aFilter.push(
                        new Filter({
                            filters:[
                                new Filter("FirstName", FilterOperator.Contains, sName),
                                new Filter("LastName", FilterOperator.Contains, sName)
                            ],
                            and: false
                        })
                    );
                }

                if (sCountry) {
                    aFilter.push(new Filter("Country", FilterOperator.EQ, sCountry));
                }

                let oTable = this.byId("tableEmployee"),
                    oBinding = oTable.getBinding("items");
                    oBinding.filter(aFilter);
            },

            onClearFilter: function () {
                let oTable = this.byId("tableEmployee"),
                    oBinding = oTable.getBinding("items");
                    oBinding.filter([]);

                let oViewModel = this.getView().getModel("jsonCountries");
                    oViewModel.setProperty("/EmployeeId", ""),
                    oViewModel.setProperty("/CountryKey", "");
            },

            onShowPostalCode: function (oEvent) {
                let oItem = oEvent.getSource(),
                    oBinding = oItem.getBindingContext("northwind");
                sap.m.MessageToast.show("PostalCode: "+oBinding.getProperty("PostalCode"));
            },

            onShowCity: function () {
                let oModelConfig = this.getView().getModel("jsonConfig");
                oModelConfig.setProperty("/visibleCity", true);
                oModelConfig.setProperty("/visibleBtnHideCity", true);
                oModelConfig.setProperty("/visibleBtnShowCity", false);
            },

            onHideCity: function () {
                let oModelConfig = this.getView().getModel("jsonConfig");
                oModelConfig.setProperty("/visibleCity", false);
                oModelConfig.setProperty("/visibleBtnHideCity", false);
                oModelConfig.setProperty("/visibleBtnShowCity", true); 
            }
        });
    });
