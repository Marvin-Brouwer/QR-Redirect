'use strict';
class FlashImageProcessor {
    nextFallback() { }
    declinedFallback() { }
    static flashAccepted() {
        //this.currentFlashImageProcessor.declinedFallback();
    }
    static flashDeclined() {
        this.currentFlashImageProcessor.declinedFallback();
    }
    static flashGetWindowDimensions() {
        this.currentFlashImageProcessor.flashVideo.setDimensions(screen.availWidth, screen.availHeight);
    }
    initiate() {
        FlashImageProcessor.currentFlashImageProcessor = this;
        this.buildHtml();
        this.initializeFlash();
        qrcode.callback = this.qrCallback.bind(this);
    }
    buildHtml() {
        swfobject.embedSWF('CamCanvas.swf', document.querySelector('body'), '100%', '100%', 10);
        this.flashVideo = document.querySelector('object');
        this.flashVideo.setAttribute('wmode', 'transparent');
        this.flashVideo.onloadeddata = () => alert('data');
        this.flashVideo.onended = () => alert('end');
        this.flashVideo.onbeforeactivate = () => alert('act');
        this.flashVideo.onplay = () => alert('play');
        var movieParam = document.createElement('param');
        movieParam.name = 'movie';
        movieParam.value = 'CamCanvas.swf';
        var qualityParam = document.createElement('param');
        qualityParam.name = 'quality';
        qualityParam.value = 'high';
        var allowScriptAccessParam = document.createElement('param');
        allowScriptAccessParam.name = 'allowScriptAccess';
        allowScriptAccessParam.value = 'always';
        this.flashVideo.appendChild(movieParam);
        this.flashVideo.appendChild(qualityParam);
        this.flashVideo.appendChild(allowScriptAccessParam);
    }
    initializeFlash() {
        var takePicture = () => {
            try {
                this.flashVideo.ccCapture();
            }
            catch (e) {
                console.log(e);
            }
        };
        this.flashVideo.onload = () => {
            this.flashVideo.focus();
            this.flashVideo.click();
        };
        this.flashVideo.onactivate = () => {
            try {
                // why doesn't the flash movie load?
                this.flashVideo.ccInit();
                //qrcode.decode();
                // todo: http://help.adobe.com/en_US/as3/dev/WSfffb011ac560372f3fa68e8912e3ab6b8cb-8000.html#WS5b3ccc516d4fbf351e63e3d118a9b90204-7d37
                // https://github.com/taboca/CamCanvas-API-/tree/300da2f250c76361a81a27dd35f503185bf338fe
                // Create custom implementation of the swf that detects wether or not the camera is blocked and polish up the external calls a bit.
                window.setInterval(takePicture, 1500);
            }
            catch (e) {
                console.log(e);
            }
        };
        this.flashVideo.style.visibility = 'visible';
    }
    qrCallback(data) {
        Application.current.qrCallback(data, (error) => { });
    }
}
// Test for ccCapture
// ReSharper disable once TsNotResolved
var passLine = stringPixels => {
    //a = (intVal >> 24) & 0xff;
    var coll = stringPixels.split("-");
    //console.log(coll[0]);
};
//# sourceMappingURL=FlashImageProcessor.js.map