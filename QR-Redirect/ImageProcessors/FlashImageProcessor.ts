﻿declare var swfobject :any;

class FlashImageProcessor implements IImageProcessor {
    public nextFallback(): void { }
    public declinedFallback(): void { }
    private flashVideo: HTMLObjectElement;

    // This is necessary for the ExternalModule flash implementation
    private static currentFlashImageProcessor: FlashImageProcessor;
    public static flashAccepted() {
        //this.currentFlashImageProcessor.declinedFallback();
    }
    public static flashDeclined() {
        this.currentFlashImageProcessor.declinedFallback();
    }

    public initiate(): void {
        FlashImageProcessor.currentFlashImageProcessor = this;
        this.buildHtml();
        this.initializeFlash();
        qrcode.callback = this.qrCallback.bind(this);
    }

    private buildHtml() {
        swfobject.embedSWF('lib/camcanvas.swf', document.body, '100%', '100%', 10, '0x00000', 'high');
        this.flashVideo = <HTMLObjectElement>document.querySelector('object');
    }

    private initializeFlash() {
        var takePicture = () => {

            try {
                (<any>this.flashVideo).ccCapture();
            } catch (e) {
                console.log(e);
            }
            window.requestAnimationFrame(takePicture);
        };
        (<any>this.flashVideo).onactivate = () => {
            try {
                // why doesn't the flash movie load?
                (<any>this.flashVideo).ccInit();
                //qrcode.decode();
                // todo: http://help.adobe.com/en_US/as3/dev/WSfffb011ac560372f3fa68e8912e3ab6b8cb-8000.html#WS5b3ccc516d4fbf351e63e3d118a9b90204-7d37
                // https://github.com/taboca/CamCanvas-API-/tree/300da2f250c76361a81a27dd35f503185bf338fe
                // Create custom implementation of the swf that detects wether or not the camera is blocked and polish up the external calls a bit.
                window.requestAnimationFrame(takePicture);
            } catch (e) {
                console.log(e);
            }
        }
        this.flashVideo.style.visibility = 'visible';
    }

    public qrCallback(data: string): void {
        Application.current.qrCallback(data, (error) => { });
    }
}

// Test for ccCapture
// ReSharper disable once TsNotResolved
window.passLine = function (stringPixels) { 
    //a = (intVal >> 24) & 0xff;

    var coll = stringPixels.split("-");

    //console.log(coll[0]);
} 