sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "employees/model/formatter"
],function (Controller, Fragment, formatter) {

    "use strict";

    return Controller.extend("employees.controller.DetailsEmployee",{

        callFormater: formatter,

        onInit: function () {
            this._oEventBus = sap.ui.getCore().getEventBus();
        },

        onCreateIncidence: function () {

            let oTableIncidence = this.byId("tableIncidence");

            let oIncidenceModel = this.getView().getModel("incidenceModel"),
                oData = oIncidenceModel.getData(),
                iIndex = oData.length;

            Fragment.load({
                name: "employees.fragment.NewIncidence",
                controller: this
            }).then(function (oNewIncidence) {
                oData.push({index: iIndex + 1});
                oIncidenceModel.refresh();
                oNewIncidence.bindElement("incidenceModel>/"+iIndex);       //Asociacion del Modelo
                oTableIncidence.addContent(oNewIncidence);
            });


        }
    });

});