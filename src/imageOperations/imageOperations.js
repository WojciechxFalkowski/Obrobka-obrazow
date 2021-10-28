export const boxFiltering = (images) => {
    const filteredImages = []
    images.forEach(imageModel => {
        const activeImages = imageModel.images.filter(image => image.isActive)
        activeImages.forEach(image => {
            const imgEl = new Image();
            imgEl.src = image.path;
            const src = window.cv.imread(imgEl);
            const dst = new window.cv.Mat();
            const ksize = new window.cv.Size(5, 5);
            const anchor = new window.cv.Point(-1, -1);
            window.cv.boxFilter(src, dst, src.depth(), ksize, anchor, true, window.cv.BORDER_DEFAULT);

            const canvasImage = convertToCanvas(dst, imageModel.images.length);
            const newImage = convertToImage(canvasImage.toDataURL())
            filteredImages.push({modelId: imageModel.id, image: {path: newImage.src}})
        })
    })
    return filteredImages;
}
export const convertToCanvas = (dst, imageId) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.id = imageId;
    canvas.width = dst.cols;
    canvas.height = dst.rows;
    /**
     * https://stackoverflow.com/questions/38556730/imagedata-byte-length-is-not-a-multiple-of-4-width
     * 4 * width * height
     * @type {Uint8ClampedArray}
     */
        // const uint = new Uint8ClampedArray(dst.data, dst.cols, dst.rows);
    const uint = new Uint8ClampedArray(dst.data, dst.cols, dst.rows);
    const imgData = new ImageData(uint, dst.cols);

    ctx.putImageData(imgData, 0, 0)
    return canvas;
}
export const convertToImage = (imagePath) => {
    const newImage = document.createElement("img"); // create img tag
    newImage.src = imagePath;

    return newImage;
}
export const unsharpMasking = (images) => {
    const filteredImages = []
    images.forEach(imageModel => {
        const activeImages = imageModel.images.filter(image => image.isActive)
        activeImages.forEach(image => {
            const imgEl = new Image();
            imgEl.src = image.path;
            const src = window.cv.imread(imgEl);
            const dst = new window.cv.Mat();
            const arr = [0, -1, 0, -1, 5, -1, 0, -1, 0];
            const kernelSize = 3;
            const kernel = window.cv.matFromArray(kernelSize, kernelSize, window.cv.CV_32FC1, arr);
            window.cv.filter2D(src, dst, window.cv.CV_8U, kernel, new window.cv.Point(-1, -1), 0, window.cv.BORDER_DEFAULT)

            const canvasImage = convertToCanvas(dst, imageModel.images.length);
            const newImage = convertToImage(canvasImage.toDataURL())
            filteredImages.push({modelId: imageModel.id, image: {path: newImage.src}})
        })
    })
    return filteredImages
}
//TODO not working
export const bilateralFiltering = (images) => {
    const filteredImages = []
    images.forEach(imageModel => {
        const activeImages = imageModel.images.filter(image => image.isActive)
        activeImages.forEach(image => {
            const imgEl = new Image();
            imgEl.src = image.path;
            const src = window.cv.imread(imgEl);
            const dst = new window.cv.Mat();
            console.log('window.cv.COLOR_RGBA2RGB')
            console.log(window.cv.COLOR_RGBA2RGB)
            window.cv.cvtColor(src, src, window.cv.COLOR_RGBA2RGB, 0);//TODO there is a problem with rgb and rgba
            window.cv.bilateralFilter(src, dst, 4, 0, 50, window.cv.BORDER_DEFAULT);
            console.log('dst')
            console.log(dst)

            const canvasImage = convertToCanvas(dst, imageModel.images.length);
            const newImage = convertToImage(canvasImage.toDataURL())
            filteredImages.push({modelId: imageModel.id, image: {path: newImage.src}})
        })
    })
    return filteredImages;
}
export const saltAndPepper = (images) => {
    const filteredImages = []
    images.forEach(imageModel => {
        const activeImages = imageModel.images.filter(image => image.isActive)
        activeImages.forEach(image => {
            const imgEl = new Image();
            imgEl.src = image.path;
            const src = window.cv.imread(imgEl);

            for (let i = 0; i < 500; i++) {
                let row = Math.floor(Math.random() * src.rows);
                let column = Math.floor(Math.random() * src.cols);
                let chosen = Math.floor(Math.random() * 3);

                if (chosen === 0) {
                    src.ucharPtr(row, column)[0] = 255;
                    src.ucharPtr(row, column)[1] = 0;
                    src.ucharPtr(row, column)[2] = 0;
                } // if()
                else if (chosen === 1) {
                    src.ucharPtr(row, column)[0] = 0;
                    src.ucharPtr(row, column)[1] = 255;
                    src.ucharPtr(row, column)[2] = 0;
                } // else if()
                else if (chosen === 2) {
                    src.ucharPtr(row, column)[0] = 0;
                    src.ucharPtr(row, column)[1] = 0;
                    src.ucharPtr(row, column)[2] = 255;
                } // else if()
            } // for()


            const canvasImage = convertToCanvas(src, imageModel.images.length);
            const newImage = convertToImage(canvasImage.toDataURL())
            filteredImages.push({modelId: imageModel.id, image: {path: newImage.src}})
        })
    })
    return filteredImages;
}