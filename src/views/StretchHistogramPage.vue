<template>
  <div class="container-fluid">
    <HistogramTransformation :activeImage="getActiveImage" :stretchedImage="stretchedImage"
                             @boot="stretchHistogram" :methodName="'Rozciągnij histogram'"
    >
      <div class="d-flex flex-column">
        <label for="min_stretch_value">{{ minStretchValue }}</label>
        <input id="min_stretch_value" type="range" min="0" :max="255" step="1"
               v-model="minStretchValue">
      </div>

      <div class="d-flex flex-column">
        <label for="max__stretch_value">{{ maxStretchValue }}</label>
        <input id="max__stretch_value" type="range" min="0" max="255" step="1"
               v-model="maxStretchValue">
      </div>
    </HistogramTransformation>

    <HistogramTransformation :activeImage="getActiveImage" :stretchedImage="equalizedImage"
                             @boot="equalizeHistogram" :methodName="'Wyrównaj histogram'" />
    <HistogramTransformation :activeImage="getActiveImage" :stretchedImage="negationImage"
                             @boot="negation" :methodName="'Negacja'" />
    <HistogramTransformation :activeImage="getActiveImage" :stretchedImage="thresholdImage"
                             @boot="threshold" :methodName="'Progowanie'">
      <div class="d-flex flex-column">
        <label for="threshold_value">{{ tresholdValue }}</label>
        <input id="threshold_value" type="range" min="0" :max="255" step="1"
               v-model="tresholdValue">
      </div>
    </HistogramTransformation>

    <HistogramTransformation :activeImage="getActiveImage" :stretchedImage="thresholdExtendedImage"
                             @boot="thresholdExtended"
                             :methodName="'Progowanie z zachowaniem poziomów szarości'"
    >
      <div class="d-flex flex-column">
        <label for="min_threshold_extended_value">{{ minTresholdExtendedValue }}</label>
        <input id="min_threshold_extended_value" type="range" min="0" :max="255" step="1"
               v-model="minTresholdExtendedValue">
      </div>

      <div class="d-flex flex-column">
        <label for="max_threshold_extended_value">{{ maxTresholdExtendedValue }}</label>
        <input id="max_threshold_extended_value" type="range" min="0" max="255" step="1"
               v-model="maxTresholdExtendedValue">
      </div>
    </HistogramTransformation>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  stretchingHistogram,
  convertImgDataToDataUrl,
  convertImgDataToImageDataObject,
  isGrayScaleImage,
  mapPixelValuesToRGBArrays,
  equalizationHistogram, negationOperation, thresholdOperation, thresholdExtendedOperation
} from '@/imageOperations/imageOperations'
import HistogramTransformation from '@/components/HistogramTransformation'

export default {
  name: 'StretchHistogramPage',
  components: {
    HistogramTransformation
  },
  data () {
    return {
      stretchedImage: {},
      equalizedImage: {},
      negationImage: {},
      thresholdImage: {},
      thresholdExtendedImage: {},
      minStretchValue: 0,
      maxStretchValue: 255,
      minTresholdExtendedValue: 0,
      maxTresholdExtendedValue: 255,
      tresholdValue: 128
    }
  },
  updated () {
    if (parseInt(this.minStretchValue) > parseInt(this.maxStretchValue)) {
      this.minStretchValue = this.maxStretchValue
    }
    if (parseInt(this.minTresholdExtendedValue) > parseInt(this.maxTresholdExtendedValue)) {
      this.minTresholdExtendedValue = this.maxTresholdExtendedValue
    }
  },
  methods: {
    ...mapActions({ addImage: 'activeImages/addImage' }),
    stretchHistogram () {
      const imgData = stretchingHistogram(this.getActiveImage.imageData.data,
        parseInt(this.minStretchValue), parseInt(this.maxStretchValue)
      )
      const imageData =
        convertImgDataToImageDataObject(
          imgData,
          this.getActiveImage.imageData.width,
          this.getActiveImage.imageData.height
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
      this.stretchedImage = {
        id: null,
        imageData: imageData,
        imageDataURL: imageDataUrl,
        // isActive: null,
        isGrayScale: isGrayScale,
        modelId: this.getActiveImage.modelId,
        // name: null,
        // path: null,
        pixelAmounts
        // size:null,
        // time:null,
        // timestamp:null,
      }

      console.log('stretchedImage')
      console.log(this.stretchedImage)
      this.addImage(this.stretchedImage)
    },
    equalizeHistogram () {
      const imgData =
        equalizationHistogram(
          this.getActiveImage.pixelAmounts.gray,
          this.getActiveImage.imageData.data
        )
      console.log('imgData')
      console.log(imgData)
      const imageData =
        convertImgDataToImageDataObject(
          imgData,
          this.getActiveImage.imageData.width,
          this.getActiveImage.imageData.height
        )
      console.log('imageData')
      console.log(imageData)
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
      this.equalizedImage = {
        id: null,
        imageData: imageData,
        imageDataURL: imageDataUrl,
        // isActive: null,
        isGrayScale: isGrayScale,
        modelId: this.getActiveImage.modelId,
        // name: null,
        // path: null,
        pixelAmounts
        // size:null,
        // time:null,
        // timestamp:null,
      }

      this.addImage(this.equalizedImage)
    },
    negation () {

      const imgData = negationOperation(this.getActiveImage.imageData.data)
      const imageData =
        convertImgDataToImageDataObject(
          imgData,
          this.getActiveImage.imageData.width,
          this.getActiveImage.imageData.height
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
      this.negationImage = {
        id: null,
        imageData: imageData,
        imageDataURL: imageDataUrl,
        // isActive: null,
        isGrayScale: isGrayScale,
        modelId: this.getActiveImage.modelId,
        // name: null,
        // path: null,
        pixelAmounts
        // size:null,
        // time:null,
        // timestamp:null,
      }

      console.log('negationImage')
      console.log(this.negationImage)
      this.addImage(this.negationImage)
    },
    threshold () {
      console.log(this.getActiveImage)

      const imgData = thresholdOperation(this.getActiveImage.imageData.data, this.tresholdValue)
      const imageData =
        convertImgDataToImageDataObject(
          imgData,
          this.getActiveImage.imageData.width,
          this.getActiveImage.imageData.height
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
      this.thresholdImage = {
        id: null,
        imageData: imageData,
        imageDataURL: imageDataUrl,
        // isActive: null,
        isGrayScale: isGrayScale,
        modelId: this.getActiveImage.modelId,
        // name: null,
        // path: null,
        pixelAmounts
        // size:null,
        // time:null,
        // timestamp:null,
      }

      console.log('thresholdImage')
      console.log(this.thresholdImage)
      this.addImage(this.thresholdImage)
    },
    thresholdExtended () {
      console.log(this.getActiveImage)

      const imgData =
        thresholdExtendedOperation(
          this.getActiveImage.imageData.data,
          this.minTresholdExtendedValue,
          this.maxTresholdExtendedValue
        )
      const imageData =
        convertImgDataToImageDataObject(
          imgData,
          this.getActiveImage.imageData.width,
          this.getActiveImage.imageData.height
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
      this.thresholdExtendedImage = {
        id: null,
        imageData: imageData,
        imageDataURL: imageDataUrl,
        // isActive: null,
        isGrayScale: isGrayScale,
        modelId: this.getActiveImage.modelId,
        // name: null,
        // path: null,
        pixelAmounts
        // size:null,
        // time:null,
        // timestamp:null,
      }

      console.log('thresholdExtendedImage')
      console.log(this.thresholdExtendedImage)
      this.addImage(this.thresholdExtendedImage)
    }
    // stretchHistogramInGivenRange () {
    //
    //   const imgData = stretchingHistogram(this.getActiveImage.imageData.data,
    //     parseInt(this.minValue), parseInt(this.maxValue)
    //   )
    //
    //   const imageData =
    //     convertImgDataToImageDataObject(
    //       imgData,
    //       this.getActiveImage.imageData.width,
    //       this.getActiveImage.imageData.height
    //     )
    //   const imageDataUrl = convertImgDataToDataUrl(imageData).src
    //
    //   const isGrayScale = isGrayScaleImage(imageData.data)
    //
    //   const {
    //     pixelArrayR,
    //     pixelArrayG,
    //     pixelArrayB,
    //     pixelArrayRGB,
    //     pixelArrayGrayScale,
    //     maxRValue,
    //     maxGValue,
    //     maxBValue,
    //     maxRGBValue,
    //     maxGrayScaleValue
    //   } = mapPixelValuesToRGBArrays(imageData.data);
    //
    //   const pixelAmounts = {
    //     red: pixelArrayR,
    //     green: pixelArrayG,
    //     blue: pixelArrayB,
    //     rgb: pixelArrayRGB,
    //     gray: pixelArrayGrayScale,
    //     maxRValue, maxGValue, maxBValue, maxRGBValue, maxGrayScaleValue
    //   }
    //   this.stretchedImageInRange = {
    //     id: null,
    //     imageData: imageData,
    //     imageDataURL: imageDataUrl,
    //     // isActive: null,
    //     isGrayScale: isGrayScale,
    //     modelId: this.getActiveImage.modelId,
    //     // name: null,
    //     // path: null,
    //     pixelAmounts
    //     // size:null,
    //     // time:null,
    //     // timestamp:null,
    //   }
    //
    //   this.addImage(this.stretchedImageInRange)
    // }
  },
  computed: {
    ...mapGetters({
      getActiveImage: 'activeImages/getActiveImage'
    })
  }
}
</script>

<style lang="scss">
.stretch-histogram {

}

</style>