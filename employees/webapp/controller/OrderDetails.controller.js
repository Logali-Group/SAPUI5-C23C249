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

            let oUploadSet = this.byId("uploadSet");

            oUploadSet.bindAggregation("items",{
                path:'ysapui5>/FilesSet',
                filters:[
                    new sap.ui.model.Filter("OrderId", "EQ", sOrderId),
                    new sap.ui.model.Filter("SapId","EQ",sSapId),
                    new sap.ui.model.Filter("EmployeeId","EQ", sEmployeeId)
                ],
                template: new sap.m.upload.UploadSetItem({
                    fileName: "{ysapui5>FileName}",
                    mediaType: "{ysapui5>MimeType}",
                    visibleEdit: false
                })
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
        },

        onFileBeforeUpload: function (oEvent) {
            let oItem = oEvent.getParameter("item"),
                oModel = this.getView().getModel("ysapui5"),
                oBindingContext = oItem.getBindingContext("odataNorthwind"),
                sOrderID = oBindingContext.getProperty("OrderID").toString(),
                sSapID = this.getOwnerComponent().SapId,
                sEmployeeID = oBindingContext.getProperty("EmployeeID").toString(),
                sFileName = oItem.getFileName(),
                sSecurityToken = oModel.getSecurityToken();

                let sSlug = sOrderID+";"+sSapID+";"+sEmployeeID+";"+sFileName;

                let oCustomerHeaderToken = new sap.ui.core.Item({
                    key:"X-CSRF-Token",
                    text: sSecurityToken
                });

                let oCustomerHeaderSlug = new sap.ui.core.Item({
                    key:"Slug",
                    text:sSlug
                });

                oItem.addHeaderField(oCustomerHeaderToken);
                oItem.addHeaderField(oCustomerHeaderSlug);

                console.log(oItem);
            
        },

        onFileUploadCompleted: function (oEvent) {
            let oUploadSet = oEvent.getSource();
                oUploadSet.getBinding("items").refresh();
        },

        onFileDeleted: function (oEvent) {
            let oUploadSet = oEvent.getSource();
            let sPath = oEvent.getParameter("item").getBindingContext("ysapui5").getPath();


            this.getView().getModel("ysapui5").remove(sPath,{
                success: function () {
                    oUploadSet.getBinding("items").refresh();
                },
                error: function () {

                }
            });
        },

        onDownloadFile: function () {
            let oUploadSet = this.byId("uploadSet"),
                oResourceBundle = this.getView().getModel("i18n").getResourceBundle(),
                aItems = oUploadSet.getSelectedItems();

                if (aItems.length === 0 ) {
                    MessageBox.error(oResourceBundle.getText("selectFile"));
                } else {
                    aItems.forEach((oItem)=>{
                        let oBindingContext = oItem.getBindingContext("ysapui5"),
                            sPath = oBindingContext.getPath();
                            window.open("/sap/opu/odata/sap/YSAPUI5_SRV_01/"+sPath+"/$value");
                    });
                }
        }

    });

});