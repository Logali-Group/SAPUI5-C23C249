sap.ui.define([

],function () {

    let oFormatter = {
        invoicesStatus: function (sStatus) {
            let oResource = this.getView().getModel("i18n").getResourceBundle();

            switch (sStatus) {
                case 'A': return oResource.getText("invoicesStatusA");
                case 'B': return oResource.getText("invoicesStatusB");
                case 'C': return oResource.getText("invoicesStatusC");
                default: return sStatus;
            }
        }
    };  

    return oFormatter;

});