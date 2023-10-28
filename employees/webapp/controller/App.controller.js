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
                this._loadModel();
            },

            _loadModel: function () {

                let oView = this.getView(),
                    oi18n = oView.getModel("i18n").getResourceBundle();

                let oModel = new JSONModel();
                    oModel.loadData("../model/Employees.json");
                    oView.setModel(oModel, "viewModel");
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

                let oViewModel = this.getView().getModel("viewModel");
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

                let oViewModel = this.getView().getModel("viewModel");
                    oViewModel.setProperty("/EmployeeId", ""),
                    oViewModel.setProperty("/CountryKey", "");
            }
        });
    });
