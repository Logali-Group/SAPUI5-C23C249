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
            this._oEventBus.subscribe("incidence","onSaveIncidence", this.onSaveODataIncidence.bind(this));
            this._oEventBus.subscribe("incidence","onDeleteIncidence", function (sChannelId, sEvent, oBindingContext) {

                let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                let sUrl = "/IncidentsSet(IncidenceId='"+oBindingContext.getProperty("IncidenceId")+"',SapId='"+oBindingContext.getProperty("SapId")+"',EmployeeId='"+oBindingContext.getProperty("EmployeeId")+"')";
                

                this._oYSAPUI5.remove(sUrl, {
                    success: function () {
                        this.onReadODataIncidence(oBindingContext.getProperty("EmployeeId"));
                        sap.m.MessageToast.show(oResourceBundle.getText("odataDeleteOK"));
                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show(oResourceBundle.getText("odataDeleteKO"));
                    }
                });
            
            },this);
        },

        onBeforeRendering: function() {
            this._detailsEmployeeView = this.getView().byId("detailsEmployeeView");
        },

        showEmployeeDetails: function (sChanne, sEventName, sPath) {

            let oDetailsView = this.getView().byId("detailsEmployeeView");
                oDetailsView.bindElement("odataNorthwind>"+sPath);
            this.getView().getModel("jsonLayout").setProperty("/ActiveKey","TwoColumnsMidExpanded");

            let oIncidence = new JSONModel([]);
            oDetailsView.setModel(oIncidence, "incidenceModel");
            oDetailsView.byId("tableIncidence").removeAllContent();


            let oBindingContext = this._detailsEmployeeView.getBindingContext("odataNorthwind"),
                sEmployeeID = oBindingContext.getProperty("EmployeeID").toString();

            this.onReadODataIncidence(sEmployeeID);
        },

        onSaveODataIncidence: function (sId1, sId2, oBindingContext) {

            let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            let oBinding = this._detailsEmployeeView.getBindingContext("odataNorthwind");
            let iEmployeeID = oBinding.getProperty("EmployeeID");
            let sEmployeeID = iEmployeeID.toString();

            if (typeof oBindingContext.getProperty("IncidenceId") == 'undefined') {

                let oData = {
                    SapId:          this.getOwnerComponent().SapId,
                    EmployeeId:     sEmployeeID,
                    CreationDate:   oBindingContext.getProperty("CreationDate"),
                    Type:           oBindingContext.getProperty("Type"),
                    Reason:         oBindingContext.getProperty("Reason")
                };
    
                let sUrl = "/IncidentsSet";
    
                //URL, Object
                this.getView().getModel("ysapui5").create(sUrl, oData, {
                    success: function () {
                        this.onReadODataIncidence(sEmployeeID);
                        sap.m.MessageToast.show(oResourceBundle.getText("odataSaveOK"));
                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show(oResourceBundle.getText("odataSaveKO"));
                    }
                });

            } else if (oBindingContext.getProperty("CreationDateX") || oBindingContext.getProperty("ReasonX") || oBindingContext.getProperty("TypeX")) {
                //Update

                let oData = {
                    CreationDate:       oBindingContext.getProperty("CreationDate"),
                    CreationDateX:      oBindingContext.getProperty("CreationDateX"),
                    Type:               oBindingContext.getProperty("Type"),
                    TypeX:              oBindingContext.getProperty("TypeX"),
                    Reason:             oBindingContext.getProperty("Reason"),
                    ReasonX:            oBindingContext.getProperty("ReasonX")
                };

                let sIncidenceID = oBindingContext.getProperty("IncidenceId"),
                    sSapID = this.getOwnerComponent().SapId;

                let sUrl = "/IncidentsSet(IncidenceId='"+sIncidenceID+"',SapId='"+sSapID+"',EmployeeId='"+sEmployeeID+"')";

                //this.getOwnerComponent().getModel("ysapui5")
                this.getView().getModel("ysapui5").update(sUrl, oData, {
                    success: function () {
                        this.onReadODataIncidence(sEmployeeID);
                        sap.m.MessageToast.show(oResourceBundle.getText("odataUpdateOK"));
                    }.bind(this),
                    error: function () {
                        sap.m.MessageToast.show(oResourceBundle.getText("odataUpdateKO"));
                    }
                });

            }



        },

        onReadODataIncidence: function (sEmployeeID) {

            let sUrl = "/IncidentsSet";
            let sSAPID = this.getOwnerComponent().SapId;
            
            this.getView().getModel("ysapui5").read(sUrl, {
                filters:[
                    new sap.ui.model.Filter("SapId", "EQ", sSAPID),
                    new sap.ui.model.Filter("EmployeeId", "EQ", sEmployeeID)
                ],
                success: function (data) {
                    console.log("Datos de consulta");
                    console.log(data);
                    let oIncidenceModel = this._detailsEmployeeView.getModel("incidenceModel");
                        oIncidenceModel.setData(data.results);
                    let oTableIncidence = this._detailsEmployeeView.byId("tableIncidence");
                        oTableIncidence.removeAllContent();

                    for (let aux in data.results ) {
                        let oNewIncidence = sap.ui.xmlfragment("employees.fragment.NewIncidence", this._detailsEmployeeView.getController());
                        this._detailsEmployeeView.addDependent(oNewIncidence);
                        oNewIncidence.bindElement("incidenceModel>/"+aux);
                        oTableIncidence.addContent(oNewIncidence);
                    }
                }.bind(this),
                error: function (e) {
                    console.log(e);
                }
            });
        }

    });
});