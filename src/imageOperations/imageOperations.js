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
      filteredImages.push({ modelId: imageModel.id, image: { imageDataURL: newImage.src } })
    })
  })
  return filteredImages;
}

export const createImageBasedOnPath = (imagePath) => {
  const image = new Image();
  image.src = imagePath
  console.log('image')
  console.log(image)
  return image
}
/**
 * Return ImageData object from a given Uint8ClampedArray and the size of the image it contains.
 * https://developer.mozilla.org/en-US/docs/Web/API/ImageData
 * @param img
 * @returns {ImageData}
 */
export const convertImgToImgData = (img) => {
  // Create canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  // Set width and height
  canvas.width = img.width;
  canvas.height = img.height;

  // Draw the image
  ctx.drawImage(img, 0, 0);

  //It returns a Uint8ClampedArray representing a one-dimensional array
  // containing the data in the RGBA order, with integer values between 0 and 255 (inclusive).
  return ctx.getImageData(0, 0, img.width, img.height);
}
export const convertImgToDataUrl = (img) => {
  // Create canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  // Set width and height
  canvas.width = img.width;
  canvas.height = img.height;
  // Draw the image
  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL();
}
export const isGrayScaleImage = (imgData) => {
  let isGrayScale = true;


  for (let index = 0; index < imgData.length; index += 4) {
    if (imgData[index] !== imgData[index + 1] || imgData[index] !== imgData[index + 2]) {
      isGrayScale = false;
    }
  }
  return isGrayScale
}
export const convertImgDataToImageDataObject = (imgData, width, height) => {
  const uint = new Uint8ClampedArray(imgData, height, width);
  return new ImageData(uint, height)
}
export const convertImgDataToDataUrl = (imageData) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx.putImageData(imageData, 0, 0);

  const image = new Image();
  image.src = canvas.toDataURL();
  return image;
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
  const newImage = document.createElement('img'); // create img tag
  newImage.src = imagePath;

  // console.log('imagePath')
  // console.log(imagePath)
  return newImage;
}
export const mapPixelValuesToRGBArrays = (rgbaPixels) => {
  let pixelArrayR = (new Array(256)).fill(0);
  let pixelArrayG = (new Array(256)).fill(0);
  let pixelArrayB = (new Array(256)).fill(0);
  let pixelArrayRGB = (new Array(256)).fill(0);
  let pixelArrayGrayScale = (new Array(256)).fill(0);
  let maxRValue = 0;
  let maxGValue = 0;
  let maxBValue = 0;
  let maxRGBValue = 0;
  let maxGrayScaleValue = 0;
  for (let index = 0; index < rgbaPixels.length; index += 4) {
    //mapping data to arrays (red, green, blue, rgb) of 256 slots and count their amount
    pixelArrayR[rgbaPixels[index]]++;
    pixelArrayG[rgbaPixels[index + 1]]++;
    pixelArrayB[rgbaPixels[index + 2]]++;
    pixelArrayRGB[rgbaPixels[index]]++;
    pixelArrayRGB[rgbaPixels[index + 1]]++;
    pixelArrayRGB[rgbaPixels[index + 2]]++;
    const grayScalePixel = Math.round(rgbaPixels[index] * 0.299 + rgbaPixels[index + 1] * 0.587 + rgbaPixels[index + 2] * 0.114)
    pixelArrayGrayScale[grayScalePixel]++;
  }

  // Find max value in arrays
  maxRValue = Math.max(...pixelArrayR);
  maxGValue = Math.max(...pixelArrayG)
  maxBValue = Math.max(...pixelArrayB)
  maxRGBValue = Math.max(maxRValue, maxGValue, maxBValue)
  maxGrayScaleValue = Math.max(...pixelArrayGrayScale)

  return {
    pixelArrayR,
    pixelArrayG,
    pixelArrayB,
    pixelArrayRGB,
    pixelArrayGrayScale,
    maxRValue,
    maxGValue,
    maxBValue,
    maxRGBValue,
    maxGrayScaleValue
  }
}

// Gray scale images
export const equalizationHistogram = (grayLut, rgbaPixels) => {
  const pixelSum = rgbaPixels.length / 4;
  console.log('pixelSum')
  console.log(pixelSum)
  const lut = (new Array(256)).fill(0);
  const distributor = (new Array(256)).fill(0);
  let dMin = 0;

  for (let index = 0; index < distributor.length; ++index) {
    for (let k = 0; k <= index; ++k) {
      distributor[index] += grayLut[k];
    }
    lut[index] = Math.round(((distributor[index] - dMin) / (pixelSum - dMin)) * 255);
  }

  console.log('lut')
  console.log(lut)
  return rgbaPixels.map(channel => {
    return lut[channel]
  })
}

export const stretchingHistogram = (rgbaPixels, qMin, qMax) => {
  const lut = (new Array(256)).fill(0);
  let pMax = 0;
  let pMin = 255;

  for (let index = 0; index < rgbaPixels.length; index += 4) {
    const rChanel = rgbaPixels[index]
    const gChanel = rgbaPixels[index + 1]
    const bChanel = rgbaPixels[index + 2]

    if (rChanel < pMin) pMin = rChanel
    if (gChanel < pMin) pMin = gChanel
    if (bChanel < pMin) pMin = bChanel

    if (rChanel > pMax) pMax = rChanel
    if (gChanel > pMax) pMax = gChanel
    if (bChanel > pMax) pMax = bChanel
  }

  for (let index = 0; index < lut.length; ++index) {
    if (index < pMin) {
      lut[index] = 0;
    } else if (index > pMax) {
      lut[index] = 255;
    } else {
      lut[index] = Math.round((qMin + ((index - pMin) * (qMax - qMin)) / (pMax - pMin)));
    }
  }

  return rgbaPixels.map(channel => {
    return lut[channel]
  })

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
      filteredImages.push({ modelId: imageModel.id, image: { imageDataURL: newImage.src } })
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
      filteredImages.push({ modelId: imageModel.id, image: { imageDataURL: newImage.src } })
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
      filteredImages.push({ modelId: imageModel.id, image: { imageDataURL: newImage.src } })
    })
  })
  return filteredImages;
}