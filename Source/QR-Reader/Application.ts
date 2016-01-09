﻿'use strict';

declare var qrcode: any;

class Application {
    public static current: Application;

    private imageProcessorFacade: ImageProcessorFacade;
    private dataProcessorFacade: DataProcessorFacade;

    constructor() {
        this.setTitle('Loading...');
        Application.current = this;

        // Start processors 
        // I realize thei're not Factories but I don't have a better word for this
        this.imageProcessorFacade = new ImageProcessorFacade(new UploadImageProcessor())
            .addImageProcessor(new Html5ImageProcessor())
            .addImageProcessor(new FlashImageProcessor())
            .initiate();
        this.dataProcessorFacade = new DataProcessorFacade()
            .addDataProcessor(new TextDataProcessor())
            .addDataProcessor(new UrlDataProcessor())
            .addDataProcessor(new VCardDataProcessor())
            .addDataProcessor(new SMSDataProcessor());
        
        this.initialize();
    }

    private initialize() {
        this.reset();
    }
    public setTitle(title: string) {
        document.title = `QR-Reader - ${title}`;
    }

    public reset() {
        this.setTitle('Select QR-Code');
    }

    public qrCallback(data: string, errorFunc: (error: string) => void) {
        try {
            this.dataProcessorFacade.calculate(data);
        } catch (e) {
            errorFunc(e.message);
        }
        return;
    }
}

window.onload = () => new Application();