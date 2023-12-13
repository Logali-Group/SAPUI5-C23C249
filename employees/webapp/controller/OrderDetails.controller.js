sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox"
],function (Controller, History, MessageBox) {

    return Controller.extend("employees.controller.OrderDetails",{

        onInit: function () {
            let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute("RouteDetails").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {

            let oArgs = oEvent.getParameter("arguments"),
                sOrderId = oArgs.OrderID;

                this.getView().bindElement({
                    path: "/Orders("+sOrderId+")",
                    model: "odataNorthwind",
                    events: {
                        dataReceived: function (oObject) {
                            this._readSignature.bind(this)(oObject);
                        }.bind(this)
                    }
                });

                let oBindingContext = this.getView().getBindingContext("odataNorthwind"),
                    oObject = oBindingContext.getObject();

                    if (oObject) {
                        this._readSignature.bind(this)(oObject);
                    }
            
        },

        _readSignature: function (oObject) {
            let oData;

            try {
              oData = oObject.getParameter("data");
            } catch (err) {
                oData = oObject;
            }

            let sOrderId = oData.OrderID.toString(),
                sSapId = this.getOwnerComponent().SapId,
                sEmployeeId = oData.EmployeeID.toString();


            let sUrl = "/SignatureSet(OrderId='"+sOrderId+"',SapId='"+sSapId+"',EmployeeId='"+sEmployeeId+"')";

            this.getView().getModel("ysapui5").read(sUrl,{
                success: function (data) {
                    let oSignature = this.getView().byId("signature");
                    if (data.MediaContent !== "") {
                        oSignature.setSignature("data:image/png;base64,"+data.MediaContent);
                    }
                }.bind(this),
                error: function (err) {
                    console.log(err);
                }
            });
        },

        onNavToBack: function (oEvent) {

            let oHistory = History.getInstance(),
                sPreviuosHash = oHistory.getPreviousHash();

            if (sPreviuosHash !== undefined) {
                window.history.go(-1);
            } else {
                let oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteMain");
            }
            
        },

        onClearSignature: function () {
            let oSignature = this.getView().byId("signature");
                oSignature.clear();
        },

        onSaveSignature: function () {
            let oSignature = this.getView().byId("signature");
            let oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
            let oSignaturePng;
            
            console.log(oSignature.isFill());

            if (!oSignature.isFill()) {
                MessageBox.error(oResourceBundle.getText("fillSignature"));
            } else {

                oSignaturePng = oSignature.getSignature().replace("data:image/png;base64,","");

                let oBindingContext = this.getView().getBindingContext("odataNorthwind"),
                    sOrderID = oBindingContext.getProperty("OrderID").toString(),
                    sEmployeeID = oBindingContext.getProperty("EmployeeID").toString();

                let OData = {
                    OrderId: sOrderID,
                    SapId: this.getOwnerComponent().SapId,
                    EmployeeId: sEmployeeID,
                    MimeType: "image/png",
                    MediaContent: oSignaturePng
                };

                let sUrl ="/SignatureSet";
                this.getView().getModel("ysapui5").create(sUrl, OData, {
                    success: function () {
                        MessageBox.information(oResourceBundle.getText("signatureSaved"));
                    },
                    error: function () {
                        MessageBox.error(oResourceBundle.getText("signatureNotSaved"));
                    }
                });
            }
        }

    });

});