﻿'use strict';

class ImageProcessorFacade {
    private imageProcessors : Array<IImageProcessor>;
    private defaultImageProcessor: IImageProcessor;

    constructor(defaultImageProcessor: IImageProcessor) {
        this.defaultImageProcessor = defaultImageProcessor;
        this.imageProcessors = new Array<IImageProcessor>();
    }

    public addImageProcessor(imageProcessor: IImageProcessor) : ImageProcessorFacade {
        this.imageProcessors.push(imageProcessor);
        return this;
    }

    public initiate() : ImageProcessorFacade  {
        for (let i = 0; i < this.imageProcessors.length; i++) {
            let imageProcessor = this.imageProcessors[i];
            let nextImageProcessor = this.imageProcessors[i + 1] || null;
            imageProcessor.nextFallback = nextImageProcessor != null ?
                nextImageProcessor.initiate.bind(nextImageProcessor) :
                this.defaultImageProcessor.initiate.bind(this.defaultImageProcessor);
            imageProcessor.declinedFallback = this.defaultImageProcessor.initiate.bind(this.defaultImageProcessor);
        }

        // ReSharper disable once WrongExpressionStatement
        this.imageProcessors[0].initiate();
        return this;
    }
}