import {
  convertImgDataToImageDataObject,
  convertImgDataToDataUrl,
  isGrayScaleImage, mapPixelValuesToRGBArrays
} from '@/imageOperations/imageOperations'

export const createImageModel = (imgData,imageWidth,imageHeight)=> {
  const imageData =
    convertImgDataToImageDataObject(
      imgData,
      imageWidth,
      imageHeight
    )

  const imageDataUrl = convertImgDataToDataUrl(imageData).src

  const isGrayScale = isGrayScaleImage(imageData.data)

  const {
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
  } = mapPixelValuesToRGBArrays(imageData.data);

  const pixelAmounts = {
    red: pixelArrayR,
    green: pixelArrayG,
    blue: pixelArrayB,
    rgb: pixelArrayRGB,
    gray: pixelArrayGrayScale,
    maxRValue, maxGValue, maxBValue, maxRGBValue, maxGrayScaleValue
  }

  return { imageData, imageDataUrl, isGrayScale, pixelAmounts }
}