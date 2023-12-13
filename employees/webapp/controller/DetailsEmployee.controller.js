sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "employees/model/formatter"
],function (Controller, formatter) {

    "use strict";

    return Controller.extend("employees.controller.DetailsEmployee",{

        callFormater: formatter,

        onInit: function () {
            this._oEventBus = sap.ui.getCore().getEventBus();
        },

        onCreateIncidence: function () {
            let oTableIncidence = this.byId("tableIncidence");
            let oNewIncidence = sap.ui.xmlfragment("employees.fragment.NewIncidence", this);
            let oIncidenceModel = this.getView().getModel("incidenceModel"),
                oData = oIncidenceModel.getData(),
                iIndex = oData.length;
                oData.push({index: iIndex + 1});
                oIncidenceModel.refresh();
                oNewIncidence.bindElement("incidenceModel>/"+iIndex);       //Asociacion del Modelo
            oTableIncidence.addContent(oNewIncidence);
        },

        onSaveIncidence: function (oEvent) {
            let oIncidence = oEvent.getSource().getParent().getParent();
            let oBindingContext = oIncidence.getBindingContext("incidenceModel");
            // Llamada de un metodo, que esta en el controlador Main.
            this._oEventBus.publish("incidence","onSaveIncidence", oBindingContext); 
        },

        onDeleteIncidence: function (oEvent) {
            let oBindingContext = oEvent.getSource().getBindingContext("incidenceModel");
            console.log(oBindingContext.getObject());
            this._oEventBus.publish("incidence","onDeleteIncidence", oBindingContext);
        },

        updateIncidenceCreationDate: function (oEvent) {
            console.log("Se detecto un cambio en el campo DatePicker");
            let oBindingContext = oEvent.getSource().getBindingContext("incidenceModel"),
                oObject = oBindingContext.getObject();
                oObject.CreationDateX = true;
        },

        updateIncidenceReason: function (oEvent) {
            console.log("Se detecto un cambio en el campo Reason");
            let oBindingContext = oEvent.getSource().getBindingContext("incidenceModel"),
                oObject = oBindingContext.getObject();
                oObject.ReasonX = true;
        },

        updateIncidenceType: function (oEvent) {
            console.log("Se detecto un cambio en el campo Type");
            let oBindingContext = oEvent.getSource().getBindingContext("incidenceModel"),
                oObject = oBindingContext.getObject();
                oObject.TypeX = true;
        }
    });

});
