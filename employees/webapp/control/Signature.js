sap.ui.define([
    "sap/ui/core/Control"
],function (Control) {

    "use strict";

    return Control.extend("employees.control.Signature",{

        metadata: {
            properties:{
                "width":{
                    type:'sap.ui.core.CSSSize',
                    defaultValue:'400px'
                },
                "height":{
                    type:'sap.ui.core.CSSSize',
                    defaultValue: '100px'
                },
                "bgcolor":{
                    type:'sap.ui.core.CSSColor',
                    defaultValue:"white"
                }
            }
        },

        init: function () {

        },

        renderer: function (oRm, oControl) {
            oRm.write("<div");
                oRm.addStyle("width", oControl.getProperty("width"));
                oRm.addStyle("height", oControl.getProperty("height"));
                oRm.addStyle("background-color", oControl.getProperty("bgcolor"));
                oRm.addStyle("border", "1px solid black");
                oRm.writeStyles();
            oRm.write(">");

                oRm.write("<canvas width='"+oControl.getProperty("width")+"' height='"+oControl.getProperty("height")+"'");
                oRm.write("></canvas>");

            oRm.write("</div>");
        },

        onAfterRendering: function () {
            let oCanvas = document.querySelector("canvas");
            try {
                this._oSignature = new SignaturePad(oCanvas);
                this._oSignature.fill = false;
                oCanvas.addEventListener("pointerdown", function () {
                    console.log("Entro en el evento pointerdown");
                    this._oSignature.fill = true;
                }.bind(this));
            } catch (err) {
                console.log(err);
            }
        },

        clear: function () {
            this._oSignature.clear();
            this._oSignature.fill = false;
        },

        isFill: function () {
            return this._oSignature.fill;
        },


        getSignature: function () {
            return this._oSignature.toDataURL();
        },

        setSignature: function (oSignature) {
            this._oSignature.fromDataURL(oSignature);
        }

    });

});