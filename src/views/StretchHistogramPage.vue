<template>
  <div class="container-fluid">
    <HistogramTransformation :activeImage="getActiveImage" :stretchedImage="stretchedImage"
                             @boot="stretchHistogram" :methodName="'Rozciągnij histogram'" />
    <HistogramTransformation :activeImage="getActiveImage" :stretchedImage="equalizedImage"
                             @boot="equalizeHistogram" :methodName="'Wyrównaj histogram'"/>
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
  equalizationHistogram
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
      equalizedImage:{},
    }
  },
  created () {
    console.log(this.getActiveImage)
  },
  methods: {
    ...mapActions({ addImage: 'activeImages/addImage' }),
    stretchHistogram () {
      const imgData = stretchingHistogram(this.getActiveImage.imageData.data, 0, 255)

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

      this.addImage(this.stretchedImage)
    },
    equalizeHistogram () {
      const imgData =
        equalizationHistogram(
          this.getActiveImage.pixelAmounts.gray,
          this.getActiveImage.imageData.data
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
    }
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