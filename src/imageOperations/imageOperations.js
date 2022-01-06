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

      const canvasImage = convertToCanvas(dst);
      const newImage = convertToImage(canvasImage.toDataURL())
      filteredImages.push({ modelId: imageModel.id, image: { imageDataURL: newImage.src } })
    })
  })
  return filteredImages;
}

export const createImageBasedOnPath = (imagePath) => {
  const image = new Image();
  image.src = imagePath
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
  return new ImageData(uint, width)
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
export const convertToCanvas = (rgbaPixels, width, height) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = width;
  canvas.height = height;
  /**
   * https://stackoverflow.com/questions/38556730/imagedata-byte-length-is-not-a-multiple-of-4-width
   * 4 * width * height
   * @type {Uint8ClampedArray}
   */
    // const uint = new Uint8ClampedArray(dst.data, dst.cols, dst.rows);
  const uint = new Uint8ClampedArray(rgbaPixels, width, height);
  const imgData = new ImageData(uint, width);

  ctx.putImageData(imgData, 0, 0)
  return canvas;
}
export const convertToImage = (imagePath) => {
  const newImage = document.createElement('img'); // create img tag
  newImage.src = imagePath;

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

// Color images
export const equalizationHistogramLab = (lLUT, rgbaPixels) => {
  console.log('equalizationHistogram')
  console.log(lLUT)
  console.log(rgbaPixels)

  console.log()
  const pixelSum = rgbaPixels.length / 4;
  // console.log('pixelSum')
  // console.log(pixelSum)
  const lut = (new Array(256)).fill(0);
  // console.log('lut')
  // console.log(lut)
  const distributor = (new Array(256)).fill(0);
  // console.log('distributor')
  // console.log(distributor)

  let dMin = 0;

  for (let index = 0; index < distributor.length; ++index) {
    for (let k = 0; k <= index; ++k) {
      distributor[index] += lLUT[k];
    }
  }
  console.log('distributor after')
  console.log(distributor)

  for (let index = 0; index < distributor.length; index++) {
    if (dMin === 0) {
      // first not 0 value
      dMin = distributor[index] / distributor[distributor.length - 1]
    }
  }

  // console.log('dMin')
  // console.log(dMin)
  for (let index = 0; index < distributor.length; index++) {
    lut[index] = Math.round(((distributor[index] - dMin) / (pixelSum - dMin)) * 255);
  }
  // console.log('lut')
  // console.log(lut)

  const a = rgbaPixels.map(channel => {
    return lut[channel]
  })
  // console.log('a')
  // console.log(a)
  return a
}

// Gray scale images
export const equalizationHistogram = (grayLut, rgbaPixels) => {
  const pixelSum = rgbaPixels.length / 4;
  const lut = (new Array(256)).fill(0);
  const distributor = (new Array(256)).fill(0);

  let dMin = 0;

  for (let index = 0; index < distributor.length; ++index) {
    for (let k = 0; k <= index; ++k) {
      distributor[index] += grayLut[k];
    }
  }

  for (let index = 0; index < distributor.length; index++) {
    if (dMin === 0) {
      // first not 0 value
      dMin = distributor[index] / distributor[distributor.length - 1]
    }
  }

  for (let index = 0; index < distributor.length; index++) {
    lut[index] = Math.round(((distributor[index] - dMin) / (pixelSum - dMin)) * 255);
  }
  return  rgbaPixels.map(channel => {
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

export const negationOperation = (rgbaPixels) => {
  const lut = []
  for (let index = 0; index <= 255; index++) {
    lut.push(255 - index)
  }
  return rgbaPixels.map((channel, index) => {
    if (index % 4 === 3) return channel
    return lut[channel]
  })
}

export const toGrayScale = (rgbaPixels) => {
  const grayPixels = []
  for (let index = 0; index < rgbaPixels.length; index += 4) {
    //mapping data to arrays (red, green, blue, rgb) of 256 slots and count their amount
    const r = rgbaPixels[index];
    const g = rgbaPixels[index + 1];
    const b = rgbaPixels[index + 2];
    const grayScalePixel = Math.round(r * 0.299 + g * 0.587 + b * 0.114)
    grayPixels.push(...[grayScalePixel, grayScalePixel, grayScalePixel, rgbaPixels[index + 3]]);
  }
  return grayPixels;
}

export const thresholdExtendedOperation = (rgbaPixels, minTresholdExtendedValue, maxTresholdExtendedValue) => {

  const grayScaledPixels = toGrayScale(rgbaPixels)

  const thresholdrgbaPixels = []
  for (let i = 0; i < grayScaledPixels.length; i += 4) {
    if (grayScaledPixels[i] > maxTresholdExtendedValue || grayScaledPixels[i] < minTresholdExtendedValue) {
      thresholdrgbaPixels.push(0);
    } else {
      thresholdrgbaPixels.push(grayScaledPixels[i]);
    }
    if (grayScaledPixels[i + 1] > maxTresholdExtendedValue || grayScaledPixels[i + 1] < minTresholdExtendedValue) {
      thresholdrgbaPixels.push(0);
    } else {
      thresholdrgbaPixels.push(grayScaledPixels[i + 1]);
    }
    if (grayScaledPixels[i + 2] > maxTresholdExtendedValue || grayScaledPixels[i + 2] < minTresholdExtendedValue) {
      thresholdrgbaPixels.push(0);
    } else {
      thresholdrgbaPixels.push(grayScaledPixels[i + 2]);
    }
    thresholdrgbaPixels.push(grayScaledPixels[i + 3]);
  }
  return thresholdrgbaPixels

}

export const thresholdOperation = (rgbaPixels, tresholdValue) => {
  const lut = [];
  for (let index = 0; index < 256; index++) {
    lut.push(tresholdValue > index ? 0 : 255)
  }
  return rgbaPixels.map(channel => {
    return lut[channel]
  })
}

export const posterizationOperation = (rgbaPixels, colorsNumber) => {
  const lut = [];
  if (colorsNumber === 1) {
    return rgbaPixels.map((channel, index) => {
      if (index % 4 === 3) return channel
      return 0
    })
  }
  const step = 255 / (colorsNumber - 1)

  for (let index = 0; index < 256; index++) {
    const stepIndex = Math.round(index / step)
    lut.push(Math.round(step * stepIndex))
  }

  return rgbaPixels.map(channel => {
    return lut[channel]
  })
}

export const stretchInRangeOperation = (rgbaPixels, p1, p2, q3, q4) => {
  const newPixels = []
  // let min = 255;
  // let max = 0;
  // let lowerThenMin = 0;
  // let higherThenMax = 0;

  for (let index = 0; index < rgbaPixels.length; index += 4) {
    if (rgbaPixels[index] >= p1 && rgbaPixels[index] <= p2) {
      newPixels.push((rgbaPixels[index] - p1) * ((q4 - q3) / (p2 - p1)) + q3); //red
    } else if (rgbaPixels[index] < p1) {
      newPixels.push(q3);
      // lowerThenMin += 1;
    } else if (rgbaPixels[index] > p2) {
      newPixels.push(q4);
      // higherThenMax += 1;
    }

    if (rgbaPixels[index + 1] >= p1 && rgbaPixels[index + 1] <= p2) {
      newPixels.push((rgbaPixels[index + 1] - p1) * ((q4 - q3) / (p2 - p1)) + q3); //green
    } else if (rgbaPixels[index + 1] < p1) {
      newPixels.push(q3);
      // lowerThenMin += 1;
    } else if (rgbaPixels[index + 1] > p2) {
      newPixels.push(q4);
      // higherThenMax += 1;
    }

    if (rgbaPixels[index + 2] >= p1 && rgbaPixels[index] <= p2) {
      newPixels.push((rgbaPixels[index + 2] - p1) * ((q4 - q3) / (p2 - p1)) + q3); //blue
    } else if (rgbaPixels[index + 2] < p1) {
      newPixels.push(q3);
      // lowerThenMin += 1;
    } else if (rgbaPixels[index + 2] > p2) {
      newPixels.push(q4);
      // higherThenMax += 1;
    }
    newPixels.push(rgbaPixels[index + 3]);

    // const rgbMin = Math.min(rgbaPixels[index],rgbaPixels[index+1],rgbaPixels[index+2])
    // const rgbMax = Math.min(rgbaPixels[index],rgbaPixels[index+1],rgbaPixels[index+2])
    // if(rgbMin<min)
    // {
    //   min = rgbMin
    // }
    // if(rgbMax>max)
    // {
    //   max = rgbMax
    // }

  }

  // console.log('min', min)
  // console.log('max', max)
  // console.log('lower', lowerThenMin)
  // console.log('higher', higherThenMax)
  return newPixels
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

      const canvasImage = convertToCanvas(dst);
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
      window.cv.cvtColor(src, src, window.cv.COLOR_RGBA2RGB, 0);//TODO there is a problem with rgb and rgba
      window.cv.bilateralFilter(src, dst, 4, 0, 50, window.cv.BORDER_DEFAULT);

      const canvasImage = convertToCanvas(dst);
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


      const canvasImage = convertToCanvas(src);
      const newImage = convertToImage(canvasImage.toDataURL())
      filteredImages.push({ modelId: imageModel.id, image: { imageDataURL: newImage.src } })
    })
  })
  return filteredImages;
}
export const ostuThreshold = (canvas, type) => {
  const dst = new window.cv.Mat();
  const src = window.cv.imread(canvas);

  window.cv.cvtColor(src, src, window.cv.COLOR_BGR2GRAY);

  if (type === 'otsu') {
    window.cv.threshold(src, dst, 0, 255, window.cv.THRESH_BINARY + window.cv.THRESH_OTSU)
  } else {
    let mode = type === 'adaptive-mean' ? window.cv.ADAPTIVE_THRESH_MEAN_C : window.cv.ADAPTIVE_THRESH_GAUSSIAN_C;
    window.cv.adaptiveThreshold(src, dst, 255, mode, window.cv.THRESH_BINARY, 3, 2)
  }
  window.cv.imshow(canvas, dst);
  src.delete()
  dst.delete()
  return canvas

}